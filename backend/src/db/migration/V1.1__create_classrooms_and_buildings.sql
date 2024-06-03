drop table if exists objects;
drop table if exists location_details;
drop table if exists transitions_details;
drop table if exists floor_details;
drop table if exists building_details;
drop table if exists organization_details;

create table objects (
    id uuid not null primary key,
    parent_id uuid,
    details_type text not null,
    created_at timestamp,
    updated_at timestamp
);

create table location_details (
    id uuid not null primary key,
    display_name text,
    location_type text,
    index_on_track integer not null,
    created_at timestamp,
    updated_at timestamp
);

create table transitions_details (
    id uuid not null primary key,
    from_object_id uuid not null,
    to_object_id uuid not null,
    created_at timestamp,
    updated_at timestamp
);

create table floor_details (
    id uuid not null primary key,
    order integer not null,
    created_at timestamp,
    updated_at timestamp
);

create table building_details (
    id uuid not null primary key,
    name text,
    created_at timestamp,
    updated_at timestamp
);

create table organization_details (
    id uuid not null primary key,
    shortName text,
    fullName text,
    info text,
    created_at timestamp,
    updated_at timestamp
);

alter table if exists objects
    add constraint objects_object_fk
    foreign key (parent_id) references objects on delete cascade;
