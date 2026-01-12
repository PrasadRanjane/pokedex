interface Pokemon {
    name: string;
    url: string;
    imageFront: string;
    imageBack: string;
    imageFrontShiny: string;
    imageBackShiny: string;
    types: PokemonType[];
  }
  interface PokemonType {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }
  
  interface PokemonResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Pokemon[];
  }
  
   interface PokemonDetailsByURL {
    abilities: Ability2[];
    base_experience: number;
    cries: Cries;
    forms: Ability[];
    game_indices: Gameindex[];
    height: number;
    held_items: Helditem[];
    id: number;
    is_default: boolean;
    location_area_encounters: string;
    moves: Move[];
    name: string;
    order: number;
    past_abilities: Pastability[];
    past_types: Pasttype[];
    species: Ability;
    sprites: Sprites;
    stats: Stat[];
    types: Type[];
    weight: number;
  }

  export interface Pasttype {
    generation: Ability;
    types: Type[];
  }

  export interface Helditem {
    item: Ability;
    version_details: Versiondetail[];
  }
  
  export interface Versiondetail {
    rarity: number;
    version: Ability;
  }
    
   interface PokemonDetailsByName {
    abilities: Ability2[];
    base_experience: number;
    cries: Cries;
    forms: Ability[];
    game_indices: Gameindex[];
    height: number;
    held_items: any[];
    id: number;
    is_default: boolean;
    location_area_encounters: string;
    moves: Move[];
    name: string;
    order: number;
    past_abilities: Pastability[];
    past_types: any[];
    species: Ability;
    sprites: Sprites;
    stats: Stat[];
    types: Type[];
    weight: number;
  }
  
  export interface Type {
    slot: number;
    type: Ability;
  }
  
  export interface Stat {
    base_stat: number;
    effort: number;
    stat: Ability;
  }
  
  export interface Sprites {
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
    other: Other;
    versions: Versions;
  }
  
  export interface Versions {
    'generation-i': Generationi;
    'generation-ii': Generationii;
    'generation-iii': Generationiii;
    'generation-iv': Generationiv;
    'generation-v': Generationv;
    'generation-vi': Generationvi;
    'generation-vii': Generationvii;
    'generation-viii': Generationviii;
  }
  
  export interface Generationviii {
    icons: Dreamworld;
  }
  
  export interface Generationvii {
    icons: Dreamworld;
    'ultra-sun-ultra-moon': Home;
  }
  
  export interface Generationvi {
    'omegaruby-alphasapphire': Home;
    'x-y': Home;
  }
  
  export interface Generationv {
    'black-white': Blackwhite;
  }
  
  export interface Blackwhite {
    animated: Showdown;
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
  }
  
  export interface Generationiv {
    'diamond-pearl': Showdown;
    'heartgold-soulsilver': Showdown;
    platinum: Showdown;
  }
  
  export interface Generationiii {
    emerald: Officialartwork;
    'firered-leafgreen': Fireredleafgreen;
    'ruby-sapphire': Fireredleafgreen;
  }
  
  export interface Fireredleafgreen {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
  }
  
  export interface Generationii {
    crystal: Crystal;
    gold: Gold;
    silver: Gold;
  }
  
  export interface Gold {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
    front_transparent: string;
  }
  
  export interface Crystal {
    back_default: string;
    back_shiny: string;
    back_shiny_transparent: string;
    back_transparent: string;
    front_default: string;
    front_shiny: string;
    front_shiny_transparent: string;
    front_transparent: string;
  }
  
  export interface Generationi {
    'red-blue': Redblue;
    yellow: Redblue;
  }
  
  export interface Redblue {
    back_default: string;
    back_gray: string;
    back_transparent: string;
    front_default: string;
    front_gray: string;
    front_transparent: string;
  }
  
  export interface Other {
    dream_world: Dreamworld;
    home: Home;
    'official-artwork': Officialartwork;
    showdown: Showdown;
  }
  
  export interface Showdown {
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
  }
  
  export interface Officialartwork {
    front_default: string;
    front_shiny: string;
  }
  
  export interface Home {
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
  }
  
  export interface Dreamworld {
    front_default: string;
    front_female?: any;
  }
  
  export interface Pastability {
    abilities: Ability3[];
    generation: Ability;
  }
  
  export interface Ability3 {
    ability?: any;
    is_hidden: boolean;
    slot: number;
  }
  
  export interface Move {
    move: Ability;
    version_group_details: Versiongroupdetail[];
  }
  
  export interface Versiongroupdetail {
    level_learned_at: number;
    move_learn_method: Ability;
    order?: (null | number)[];
    version_group: Ability;
  }
  
  export interface Gameindex {
    game_index: number;
    version: Ability;
  }
  
  export interface Cries {
    latest: string;
    legacy: string;
  }
  
  export interface Ability2 {
    ability: Ability;
    is_hidden: boolean;
    slot: number;
  }
  
  export interface Ability {
    name: string;
    url: string;
  }



 

  
  export interface Type2 {
    slot: number;
    type: Type;
  }
  



    const pokemonTypes = {
      normal: "Normal",
      fire: "Fire",
      water: "Water",
      electric: "Electric",
      grass: "Grass",
      ice: "Ice",
      fighting: "Fighting",
      poison: "Poison",
      ground: "Ground",
      flying: "Flying",
      psychic: "Psychic",
      bug: "Bug",
      rock: "Rock",
      ghost: "Ghost",
      dragon: "Dragon",
      dark: "Dark",
      steel: "Steel",
      fairy: "Fairy",
      unknown: "Unknown",
      shadow: "Shadow",
    };
  // Light mode colors (original, slightly muted)
const pokemonTypesColorsLight = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
    unknown: "#68A090",
    shadow: "#58575F",
  };

// Dark mode colors (brighter, more vibrant)
const pokemonTypesColorsDark = {
    normal: "#C4C2A8",
    fire: "#FF9D5C",
    water: "#7AA8FF",
    electric: "#FFE143",
    grass: "#8FE066",
    ice: "#A8F0ED",
    fighting: "#E8463F",
    poison: "#C55EC7",
    ground: "#F5D77E",
    flying: "#C1ABFF",
    psychic: "#FF6BA0",
    bug: "#C4E034",
    rock: "#D4C14E",
    ghost: "#8F6DB8",
    dragon: "#8B52FF",
    dark: "#8B6F5E",
    steel: "#D0D0E8",
    fairy: "#FFADD2",
    unknown: "#7FC4B3",
    shadow: "#78767E",
  };

// Legacy export for backward compatibility
const pokemonTypesColors = pokemonTypesColorsLight;



//  moves types
export interface MoveDetailsById {
  accuracy: number;
  contest_combos: Contestcombos;
  contest_effect: Contesteffect;
  contest_type: Usebefore;
  damage_class: Usebefore;
  effect_chance?: any;
  effect_changes: any[];
  effect_entries: Effectentry[];
  flavor_text_entries: Flavortextentry[];
  generation: Usebefore;
  id: number;
  learned_by_pokemon: Usebefore[];
  machines: any[];
  meta: Meta;
  name: string;
  names: Name[];
  past_values: any[];
  power: number;
  pp: number;
  priority: number;
  stat_changes: any[];
  super_contest_effect: Contesteffect;
  target: Usebefore;
  type: Usebefore;
}

interface MoveDetails {
  accuracy: number;
  contest_combos: Contestcombos;
  contest_effect: Contesteffect;
  contest_type: Usebefore;
  damage_class: Usebefore;
  effect_chance?: any;
  effect_changes: any[];
  effect_entries: Effectentry[];
  flavor_text_entries: Flavortextentry[];
  generation: Usebefore;
  id: number;
  learned_by_pokemon: Usebefore[];
  machines: any[];
  meta: Meta;
  name: string;
  names: Name[];
  past_values: any[];
  power: number;
  pp: number;
  priority: number;
  stat_changes: any[];
  super_contest_effect: Contesteffect;
  target: Usebefore;
  type: Usebefore;
  url: string;
}

export interface Name {
  language: Usebefore;
  name: string;
}

export interface Meta {
  ailment: Usebefore;
  ailment_chance: number;
  category: Usebefore;
  crit_rate: number;
  drain: number;
  flinch_chance: number;
  healing: number;
  max_hits?: any;
  max_turns?: any;
  min_hits?: any;
  min_turns?: any;
  stat_chance: number;
}

export interface Flavortextentry {
  flavor_text: string;
  language: Usebefore;
  version_group: Usebefore;
}

export interface Effectentry {
  effect: string;
  language: Usebefore;
  short_effect: string;
}

export interface Contesteffect {
  url: string;
}

export interface Contestcombos {
  normal: Normal;
  super: Super;
}

export interface Super {
  use_after?: any;
  use_before?: any;
}

export interface Normal {
  use_after?: any;
  use_before: Usebefore[];
}

export interface Usebefore {
  name: string;
  url: string;
}




  export { pokemonTypes, pokemonTypesColors, pokemonTypesColorsLight, pokemonTypesColorsDark, Pokemon, PokemonType, PokemonResponse, PokemonDetailsByName, PokemonDetailsByURL ,MoveDetails};