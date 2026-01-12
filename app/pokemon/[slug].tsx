import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router, Link } from "expo-router";
import { useEffect, useState } from "react";
import { Other, PokemonDetailsByName } from "@/types/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useTheme } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");

interface LocationEncounter {
  location_area: {
    name: string;
    url: string;
  };
  version_details: {
    max_chance: number;
    version: {
      name: string;
      url: string;
    };
  }[];
}

export default function PokemonScreen() {
  const [loading, setLoading] = useState(true);
  const [imageType, setImageType] = useState<"default" | "shiny">("default");
  const [spriteView, setSpriteView] = useState<"basic" | "other">("basic");
  const { slug } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetailsByName | null>(null);
  const [encounters, setEncounters] = useState<LocationEncounter[]>([]);
  const [encountersLoading, setEncountersLoading] = useState(false);
  const [pokemonSprite, setPokemonSprite] = useState<keyof Other>("official-artwork");
  const { colors, pokemonTypeColors } = useTheme();


  useEffect(() => {
    async function getPokemon() {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
        const data = await res.json();
        setPokemon(data);
        
        // Fetch location encounters
        if (data.location_area_encounters) {
          setEncountersLoading(true);
          try {
            const encountersRes = await fetch(data.location_area_encounters);
            const encountersData = await encountersRes.json();
            setEncounters(encountersData);
          } catch (error) {
            console.error("Error fetching encounters:", error);
          } finally {
            setEncountersLoading(false);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    
    getPokemon();
  }, [slug]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>Pokemon not found</Text>
      </View>
    );
  }

  const primaryColor =
    pokemonTypeColors[
      pokemon.types[0].type.name as keyof typeof pokemonTypeColors
    ];
  const secondaryColor = pokemon.types[1]
    ? pokemonTypeColors[
        pokemon.types[1].type.name as keyof typeof pokemonTypeColors
      ]
    : primaryColor;

  function toggleImageType() {
    setImageType(imageType === "default" ? "shiny" : "default");
  }

  const getStatName = (name: string) => {
    const statNames: { [key: string]: string } = {
      hp: "HP",
      attack: "ATK",
      defense: "DEF",
      "special-attack": "SP.ATK",
      "special-defense": "SP.DEF",
      speed: "SPD",
    };
    return statNames[name] || name;
  };

  const maxStatValue = 255;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={[primaryColor, secondaryColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          {/* Toggle Shiny Button */}
          <TouchableOpacity
            onPress={toggleImageType}
            style={styles.shinyButton}
          >
            <MaterialIcons
              name="auto-awesome"
              size={24}
              color={imageType === "shiny" ? "#FFD700" : "white"}
            />
          </TouchableOpacity>

          {/* Pokemon ID */}
          <Text style={styles.pokemonId}>#{String(pokemon.id).padStart(3, "0")}</Text>

          {/* Pokemon Image */}
          <Image
            source={{
              uri:
                imageType === "default"
                  ? pokemon.sprites.other[pokemonSprite].front_default
                  : ((pokemon.sprites.other[pokemonSprite] as any).front_shiny ||
                      pokemon.sprites.other[pokemonSprite].front_default),
            }}
            style={styles.pokemonMainImage}
          />

          {/* Pokemon Name */}
          <Text style={styles.pokemonName}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Text>

          {/* Type Badges */}
          <View style={styles.typesContainer}>
            {pokemon.types.map((type) => (
              <Link key={type.slot} href={`/types/${type.type.name}`} asChild>
                <TouchableOpacity
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor:
                        pokemonTypeColors[
                          type.type.name as keyof typeof pokemonTypeColors
                        ],
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.typeText}>
                    {type.type.name.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
          
        </LinearGradient>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Sprite Selector */}
          <View style={[styles.section, styles.spriteSelectorContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Choose Sprite Variant</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.spritesScroll}
            >
              {(Object.entries(pokemon.sprites.other) as [keyof Other, any][]).map(([key, value]) => {
                const isSelected = key === pokemonSprite;
                return (
                  <Pressable
                    key={key}
                    style={[
                      styles.spriteVariantCard,
                      isSelected && styles.spriteVariantCardActive,
                    ]}
                    onPress={() => setPokemonSprite(key)}
                  >
                    <View style={styles.spriteVariantImageContainer}>
                      <Image
                        source={{
                          uri:
                            imageType === "default"
                              ? value.front_default
                              : ("front_shiny" in value
                                  ? value.front_shiny
                                  : value.front_default),
                        }}
                        style={styles.spriteVariantImage}
                        contentFit="contain"
                      />
                    </View>
                    <Text
                      style={[
                        styles.spriteVariantLabel,
                        isSelected && styles.spriteVariantLabelActive,
                      ]}
                      numberOfLines={2}
                    >
                      {key
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Text>
                    {isSelected && (
                      <View style={styles.spriteVariantCheckmark}>
                        <MaterialIcons name="check-circle" size={20} color={colors.primary} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
          {/* About Section */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
            <View style={styles.aboutGrid}>
              <View style={[styles.aboutItem, { backgroundColor: colors.surfaceVariant }]}>
                <MaterialIcons name="straighten" size={24} color={colors.primary} />
                <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Height</Text>
                <Text style={[styles.aboutValue, { color: colors.text }]}>{pokemon.height / 10} m</Text>
              </View>
              <View style={[styles.aboutItem, { backgroundColor: colors.surfaceVariant }]}>
                <MaterialIcons name="fitness-center" size={24} color={colors.primary} />
                <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Weight</Text>
                <Text style={[styles.aboutValue, { color: colors.text }]}>{pokemon.weight / 10} kg</Text>
              </View>
              <View style={[styles.aboutItem, { backgroundColor: colors.surfaceVariant }]}>
                <MaterialIcons name="stars" size={24} color={colors.primary} />
                <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Experience</Text>
                <Text style={[styles.aboutValue, { color: colors.text }]}>{pokemon.base_experience}</Text>
              </View>
            </View>
            
            {/* Additional Details */}
            <View style={[styles.additionalDetails, { borderTopColor: colors.border }]}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Species:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Order:</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>#{pokemon.order}</Text>
              </View>
              {pokemon.forms && pokemon.forms.length > 0 && (
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Forms:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{pokemon.forms.length}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Stats Section */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Base Stats</Text>
            {pokemon.stats.map((stat) => (
              <View key={stat.stat.name} style={styles.statRow}>
                <Text style={[styles.statName, { color: colors.textSecondary }]}>
                  {getStatName(stat.stat.name)}
                </Text>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.base_stat}</Text>
                <View style={[styles.statBarContainer, { backgroundColor: colors.surfaceVariant }]}>
                  <View
                    style={[
                      styles.statBar,
                      {
                        width: `${(stat.base_stat / maxStatValue) * 100}%`,
                        backgroundColor: primaryColor,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
            <View style={[styles.totalStatRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.totalStatLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalStatValue, { color: colors.primary }]}>
                {pokemon.stats.reduce((acc, stat) => acc + stat.base_stat, 0)}
              </Text>
            </View>
          </View>

          {/* Abilities Section */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Abilities</Text>
            <View style={styles.abilitiesContainer}>
              {pokemon.abilities.map((ability, index) => (
                <Link
                  key={ability.slot}
                  href={`/abilities/${ability.ability.name}`}
                  asChild
                >
                  <TouchableOpacity activeOpacity={0.7}>
                    <LinearGradient
                      colors={
                        ability.is_hidden
                          ? ["#fef3c7", "#fde68a"]
                          : ["#ddd6fe", "#c4b5fd"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.abilityCard,
                        ability.is_hidden && styles.hiddenAbility,
                      ]}
                    >
                      <View style={styles.abilityIconContainer}>
                        <MaterialIcons
                          name={ability.is_hidden ? "auto-awesome" : "stars"}
                          size={28}
                          color={ability.is_hidden ? "#f59e0b" : "#8b5cf6"}
                        />
                      </View>
                      <View style={styles.abilityContent}>
                        <View style={styles.abilityHeader}>
                          <Text style={styles.abilityName}>
                            {ability.ability.name
                              .split("-")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </Text>
                          {ability.is_hidden && (
                            <View style={styles.hiddenBadge}>
                              <Text style={styles.hiddenTag}>Hidden</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.abilitySlot}>Slot {ability.slot}</Text>
                      </View>
                      <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color={ability.is_hidden ? "#f59e0b" : "#8b5cf6"}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </Link>
              ))}
            </View>
          </View>

          {/* Moves Section */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Moves ({pokemon.moves.length})</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.movesScroll}
            >
              {pokemon.moves.slice(0, 20).map((move) => (
                <Link
                  key={move.move.name}
                  href={`/moves/${move.move.name}`}
                  asChild
                >
                  <TouchableOpacity style={[styles.moveCard, { backgroundColor: colors.surfaceVariant }]} activeOpacity={0.7}>
                    <MaterialIcons
                      name="flash-on"
                      size={20}
                      color={colors.primary}
                      style={styles.moveIcon}
                    />
                    <Text style={[styles.moveName, { color: colors.text }]} numberOfLines={1}>
                      {move.move.name
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Text>
                    <MaterialIcons name="chevron-right" size={16} color={colors.textTertiary} />
                  </TouchableOpacity>
                </Link>
              ))}
            </ScrollView>
            {pokemon.moves.length > 20 && (
              <Text style={[styles.moveHint, { color: colors.textSecondary }]}>
                Showing 20 of {pokemon.moves.length} moves
              </Text>
            )}
          </View>

          {/* Held Items Section */}
          {pokemon.held_items && pokemon.held_items.length > 0 && (
            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Held Items</Text>
              <View style={styles.heldItemsContainer}>
                {pokemon.held_items.map((item, index) => (
                  <View key={index} style={[styles.heldItemCard, { backgroundColor: colors.surfaceVariant }]}>
                    <MaterialIcons name="inventory" size={20} color={colors.primary} />
                    <Text style={[styles.heldItemName, { color: colors.text }]}>
                      {item.item.name
                        .split("-")
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Location Encounters Section */}
          {encounters.length > 0 && (
            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Location Encounters</Text>
              {encountersLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View style={styles.encountersContainer}>
                  {encounters.slice(0, 10).map((encounter, index) => (
                    <View key={index} style={[styles.encounterCard, { backgroundColor: colors.surfaceVariant }]}>
                      <MaterialIcons name="place" size={20} color={colors.accent} />
                      <Text style={[styles.encounterLocation, { color: colors.text }]}>
                        {encounter.location_area.name
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Text>
                    </View>
                  ))}
                  {encounters.length > 10 && (
                    <Text style={[styles.encounterHint, { color: colors.textSecondary }]}>
                      Showing 10 of {encounters.length} locations
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Sprites Gallery */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <View style={styles.spritesHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Sprites</Text>
              <View style={[styles.spriteToggleContainer, { backgroundColor: colors.surfaceVariant }]}>
                <TouchableOpacity
                  style={[
                    styles.spriteToggle,
                    spriteView === "basic" && [styles.spriteToggleActive, { backgroundColor: colors.primary }],
                  ]}
                  onPress={() => setSpriteView("basic")}
                >
                  <Text
                    style={[
                      [styles.spriteToggleText, { color: colors.textSecondary }],
                      spriteView === "basic" && styles.spriteToggleTextActive,
                    ]}
                  >
                    Basic
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.spriteToggle,
                    spriteView === "other" && [styles.spriteToggleActive, { backgroundColor: colors.primary }],
                  ]}
                  onPress={() => setSpriteView("other")}
                >
                  <Text
                    style={[
                      [styles.spriteToggleText, { color: colors.textSecondary }],
                      spriteView === "other" && styles.spriteToggleTextActive,
                    ]}
                  >
                    Variants
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.spritesScroll}
            >
              {spriteView === "basic" ? (
                <>
                  {imageType === "default" ? (
                    <>
                      {pokemon.sprites.front_default && (
                        <View style={styles.spriteCard}>
                          <Image
                            source={{ uri: pokemon.sprites.front_default }}
                            style={styles.spriteImage}
                          />
                          <Text style={styles.spriteLabel}>Front</Text>
                        </View>
                      )}
                      {pokemon.sprites.back_default && (
                        <View style={styles.spriteCard}>
                          <Image
                            source={{ uri: pokemon.sprites.back_default }}
                            style={styles.spriteImage}
                          />
                          <Text style={styles.spriteLabel}>Back</Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <>
                      {pokemon.sprites.front_shiny && (
                        <View style={styles.spriteCard}>
                          <Image
                            source={{ uri: pokemon.sprites.front_shiny }}
                            style={styles.spriteImage}
                          />
                          <Text style={styles.spriteLabel}>Shiny Front</Text>
                        </View>
                      )}
                      {pokemon.sprites.back_shiny && (
                        <View style={styles.spriteCard}>
                          <Image
                            source={{ uri: pokemon.sprites.back_shiny }}
                            style={styles.spriteImage}
                          />
                          <Text style={styles.spriteLabel}>Shiny Back</Text>
                        </View>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Dream World Sprites */}
                  {pokemon.sprites.other?.dream_world?.front_default && (
                    <View style={styles.spriteCard}>
                      <Image
                        source={{
                          uri: pokemon.sprites.other.dream_world.front_default,
                        }}
                        style={styles.spriteImageLarge}
                      />
                      <Text style={styles.spriteLabel}>Dream World</Text>
                    </View>
                  )}

                  {/* Home Sprites */}
                  {imageType === "default"
                    ? pokemon.sprites.other?.home?.front_default && (
                        <View style={styles.spriteCard}>
                          <Image
                            source={{
                              uri: pokemon.sprites.other.home.front_default,
                            }}
                            style={styles.spriteImageLarge}
                          />
                          <Text style={styles.spriteLabel}>Home</Text>
                        </View>
                      )
                    : pokemon.sprites.other?.home?.front_shiny && (
                        <View style={styles.spriteCard}>
                          <Image
                            source={{
                              uri: pokemon.sprites.other.home.front_shiny,
                            }}
                            style={styles.spriteImageLarge}
                          />
                          <Text style={styles.spriteLabel}>Home Shiny</Text>
                        </View>
                      )}

                  {/* Showdown Sprites (Animated) */}
                  {imageType === "default"
                    ? pokemon.sprites.other?.showdown?.front_default && (
                        <View style={styles.spriteCard}>
                          <Image
                            source={{
                              uri: pokemon.sprites.other.showdown.front_default,
                            }}
                            style={styles.spriteImage}
                          />
                          <Text style={styles.spriteLabel}>Showdown</Text>
                        </View>
                      )
                    : pokemon.sprites.other?.showdown?.front_shiny && (
                        <View style={styles.spriteCard}>
                          <Image
                            source={{
                              uri: pokemon.sprites.other.showdown.front_shiny,
                            }}
                            style={styles.spriteImage}
                          />
                          <Text style={styles.spriteLabel}>Showdown Shiny</Text>
                        </View>
                      )}

                  {/* Generation V Animated Sprites */}
                  {pokemon.sprites.versions?.["generation-v"]?.["black-white"]
                    ?.animated && (
                    <>
                      {imageType === "default"
                        ? pokemon.sprites.versions["generation-v"]["black-white"]
                            .animated.front_default && (
                            <View style={styles.spriteCard}>
                              <Image
                                source={{
                                  uri: pokemon.sprites.versions["generation-v"][
                                    "black-white"
                                  ].animated.front_default,
                                }}
                                style={styles.spriteImage}
                              />
                              <Text style={styles.spriteLabel}>Gen V</Text>
                            </View>
                          )
                        : pokemon.sprites.versions["generation-v"]["black-white"]
                            .animated.front_shiny && (
                            <View style={styles.spriteCard}>
                              <Image
                                source={{
                                  uri: pokemon.sprites.versions["generation-v"][
                                    "black-white"
                                  ].animated.front_shiny,
                                }}
                                style={styles.spriteImage}
                              />
                              <Text style={styles.spriteLabel}>Gen V Shiny</Text>
                            </View>
                          )}
                    </>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  shinyButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  pokemonId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 10,
  },
  pokemonMainImage: {
    width: width * 0.6,
    height: width * 0.6,
    marginVertical: 20,
  },
  pokemonName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textTransform: "capitalize",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  typesContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  typeBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  typeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  aboutGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 15,
  },
  aboutItem: {
    flex: 1,
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
  },
  aboutLabel: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
  },
  aboutValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  additionalDetails: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statName: {
    fontSize: 14,
    fontWeight: "600",
    width: 80,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    width: 40,
    textAlign: "right",
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
    overflow: "hidden",
  },
  statBar: {
    height: "100%",
    borderRadius: 4,
  },
  totalStatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 2,
  },
  totalStatLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalStatValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  abilitiesContainer: {
    gap: 12,
  },
  abilityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hiddenAbility: {
    borderWidth: 2,
    borderColor: "#fbbf24",
  },
  abilityIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  abilityContent: {
    flex: 1,
  },
  abilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  abilityName: {
    fontSize: 18,
    fontWeight: "700",
  },
  hiddenBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
  hiddenTag: {
    fontSize: 10,
    fontWeight: "800",
    color: "#f59e0b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  abilitySlot: {
    fontSize: 13,
    fontWeight: "500",
  },
  spritesScroll: {
    flexDirection: "row",
    gap: 15,
  },
  spriteCard: {
    backgroundColor: "#f1f5f9",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    minWidth: 120,
  },
  spriteImage: {
    width: 96,
    height: 96,
  },
  spriteLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },
  spriteImageLarge: {
    width: 120,
    height: 120,
  },
  movesScroll: {
    paddingRight: 20,
  },
  moveCard: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 160,
    maxWidth: 200,
  },
  moveIcon: {
    marginRight: 8,
  },
  moveName: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  moveHint: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
  heldItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  heldItemCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  heldItemName: {
    fontSize: 14,
    fontWeight: "600",
  },
  encountersContainer: {
    gap: 10,
  },
  encounterCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  encounterLocation: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  encounterHint: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  spritesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  spriteToggleContainer: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 3,
  },
  spriteToggle: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  spriteToggleActive: {
  },
  spriteToggleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  spriteToggleTextActive: {
    color: "white",
  },
  spriteSelectorContainer: {
    marginBottom: 20,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  spriteSelectorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.95)",
    marginBottom: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  spriteVariantCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
    width: 110,
    height: 110,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  spriteVariantCardActive: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  spriteVariantImageContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  spriteVariantImage: {
    width: "100%",
    height: "100%",
  },
  spriteVariantLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 14,
  },
  spriteVariantLabelActive: {
    color: "white",
    fontWeight: "700",
  },
  spriteVariantCheckmark: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 10,
  },
});
