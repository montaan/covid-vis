# TASKS

[x] Zoom based on view width

# Controls for visualization
    [] Legend for colors
    [] Nudge green more toward blue
    [] Color control
        [] Completion blue-channel toggle
        [] Based on active cases
        [] Based on reported cases
        [] Based on total cases
        [] Based on deaths
        [] Based on estimated cases (deaths or excess mortality curve-fitting)
    [] Numbers control
        [] Completion
        [] Active cases
        [] Reported cases
        [] Total cases
        [] Deaths
        [] Estimated cases
    [] Nicer date control
    [] Animate date

# More countries
    [x] Add all countries (no regions)

# Integrate COVID-19 data
    [x] Country-level data
    [x] USA States
    [] EU regions
    [] UK regions
    [] Finland municipality-level data
    [] US county level data
    [] CN province level data
    [] Regions from everywhere
    [] Adjust for excess mortality

# Match COVID-19 data to regions data
    [x] System that uses world level data as fallback
    [x] Replace countries with region level data where available
    [] Search data region from country regions

# Import pipeline for Wikipedia-format tables
    [] Parse Wikipedia tables into
        "Region": [cases, deaths, recovered, hospitalized]
    [] Make crawler for automatic daily updates
    [] Add world data to crawler
    [] Add regional-level data to crawler

# Render curves based on historical data
    [] FileView with a mesh curve created from data points
    [] Curve-fit regions to already completed curves to estimate future state

# Regional level spread estimation
    [] What's the regional correlation? If region X has curve N, what does that mean for region Y?
    [] Can we protect green regions?
    [] Can we isolate red regions -- the number of infections in lockdown regions is quite low, any way you could split the region into a red zone and a green zone?
