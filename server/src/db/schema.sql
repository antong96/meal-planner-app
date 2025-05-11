-- Býr til töflu fyrir notendur
create or replace function public.create_users_table()
returns void as $$
begin
  create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    name text,
    created_at timestamp default now()
  );
end;
$$ language plpgsql;

-- Býr til töflu fyrir uppskriftir
create or replace function public.create_recipes_table()
returns void as $$
begin
  create table if not exists recipes (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    ingredients jsonb,
    instructions text,
    created_at timestamp default now()
  );
end;
$$ language plpgsql;

-- Býr til töflu fyrir máltíðaráætlanir
create or replace function public.create_meal_plans_table()
returns void as $$
begin
  create table if not exists meal_plans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id),
    date date not null,
    meals jsonb,
    created_at timestamp default now()
  );
end;
$$ language plpgsql; 