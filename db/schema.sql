--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.3
-- Dumped by pg_dump version 9.6.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: leagues; Type: TABLE; Schema: public; Owner: confidence_pool
--

CREATE TABLE leagues (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE leagues OWNER TO confidence_pool;

--
-- Name: membership; Type: TABLE; Schema: public; Owner: confidence_pool
--

CREATE TABLE membership (
    user_id uuid NOT NULL,
    league_id uuid NOT NULL
);


ALTER TABLE membership OWNER TO confidence_pool;

--
-- Name: users; Type: TABLE; Schema: public; Owner: confidence_pool
--

CREATE TABLE users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(254) NOT NULL,
    name character varying(100) NOT NULL,
    password character(60) NOT NULL
);


ALTER TABLE users OWNER TO confidence_pool;

--
-- Name: leagues leagues_pkey; Type: CONSTRAINT; Schema: public; Owner: confidence_pool
--

ALTER TABLE ONLY leagues
    ADD CONSTRAINT leagues_pkey PRIMARY KEY (id);


--
-- Name: membership membership_pkey; Type: CONSTRAINT; Schema: public; Owner: confidence_pool
--

ALTER TABLE ONLY membership
    ADD CONSTRAINT membership_pkey PRIMARY KEY (user_id, league_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: confidence_pool
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: membership membership_league_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: confidence_pool
--

ALTER TABLE ONLY membership
    ADD CONSTRAINT membership_league_id_fkey FOREIGN KEY (league_id) REFERENCES leagues(id);


--
-- Name: membership membership_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: confidence_pool
--

ALTER TABLE ONLY membership
    ADD CONSTRAINT membership_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- PostgreSQL database dump complete
--

