-- Drop existing tables
DROP TABLE IF EXISTS communes CASCADE;
DROP TABLE IF EXISTS departements CASCADE;
DROP TABLE IF EXISTS regions CASCADE;

-- Create regions table
CREATE TABLE regions (
  id serial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  nom text NOT NULL,
  slug text UNIQUE NOT NULL,
  ensoleillement_moyen integer,
  description text
);

-- Create departements table
CREATE TABLE departements (
  id serial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  nom text NOT NULL,
  slug text UNIQUE NOT NULL,
  region_code text REFERENCES regions(code),
  ensoleillement_moyen integer,
  latitude float,
  longitude float,
  description text
);

-- Create communes table
CREATE TABLE communes (
  id serial PRIMARY KEY,
  code_insee text UNIQUE NOT NULL,
  nom text NOT NULL,
  slug text UNIQUE NOT NULL,
  code_postal text,
  departement_code text REFERENCES departements(code),
  population integer,
  latitude float,
  longitude float,
  ensoleillement_annuel integer,
  ensoleillement_janvier integer,
  ensoleillement_fevrier integer,
  ensoleillement_mars integer,
  ensoleillement_avril integer,
  ensoleillement_mai integer,
  ensoleillement_juin integer,
  ensoleillement_juillet integer,
  ensoleillement_aout integer,
  ensoleillement_septembre integer,
  ensoleillement_octobre integer,
  ensoleillement_novembre integer,
  ensoleillement_decembre integer
);

-- Performance indexes
CREATE INDEX idx_communes_slug ON communes(slug);
CREATE INDEX idx_communes_departement ON communes(departement_code);
CREATE INDEX idx_communes_code_postal ON communes(code_postal);
CREATE INDEX idx_communes_population ON communes(population DESC);
CREATE INDEX idx_communes_ensoleillement ON communes(ensoleillement_annuel DESC);
CREATE INDEX idx_departements_slug ON departements(slug);
CREATE INDEX idx_departements_region ON departements(region_code);
CREATE INDEX idx_regions_slug ON regions(slug);

-- Enable RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE departements ENABLE ROW LEVEL SECURITY;
ALTER TABLE communes ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Allow public read access" ON regions FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON departements FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON communes FOR SELECT USING (true);
