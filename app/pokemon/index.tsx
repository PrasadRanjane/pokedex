import { Pokemon, PokemonDetailsByURL, PokemonResponse, pokemonTypesColors } from "@/types/types";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");
const numColumns = 2;
const cardWidth = (width - 48) / numColumns;

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [pokemon, setPokemon] = useState<PokemonDetailsByURL[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonDetailsByURL[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [count, setCount] = useState(0);
  const { colors, isDark, pokemonTypeColors } = useTheme();
  const getPokemon = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset + limit : 0;
      const res: Response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`
      );
      const data: PokemonResponse = await res.json();
      setCount(data.count);
      const detailedPokemon = await Promise.all(
        data.results.map(async (pokemon) => {
          const res: Response = await fetch(pokemon.url);
          const data: PokemonDetailsByURL = await res.json();
          return {
            imageFront: data.sprites.front_default,
            imageBack: data.sprites.back_default,
            imageFrontShiny: data.sprites.front_shiny,
            imageBackShiny: data.sprites.back_shiny,
            ...data,
          };
        })
      );
      
      if (loadMore) {
        setPokemon((prev) => [...prev, ...detailedPokemon]);
        setLoadingMore(false);
      } else {
        setPokemon(detailedPokemon);
        setLoading(false);
      }
      setOffset(currentOffset);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getPokemon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredPokemon(pokemon);
    } else {
      const filtered = pokemon.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPokemon(filtered);
    }
  }, [searchQuery, pokemon]);

  const handleLoadMore = () => {
    if (!loadingMore && !searchQuery) {
      setLoadingMore(true);
      getPokemon(true);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <MaterialIcons name="catching-pokemon" size={64} color={colors.primary} />
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading Pokémon...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {/* Header */}
      <LinearGradient
        colors={["#6366f1", "#8b5cf6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <MaterialIcons name="catching-pokemon" size={40} color="white" />
            <Text style={styles.headerTitle}>Pokédex</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {count} Pokémon discovered
          </Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="search" size={24} color={colors.textTertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search Pokémon..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons name="close" size={24} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Pokemon Grid */}
      <FlatList
        data={filteredPokemon}
        numColumns={numColumns}
        key={numColumns}
        renderItem={({ item }) => {
          const primaryColor =
            pokemonTypeColors[
              item.types[0].type.name as keyof typeof pokemonTypeColors
            ];
          const secondaryColor = item.types.length > 1 && item.types[1]
            ? pokemonTypeColors[
                item.types[1].type.name as keyof typeof pokemonTypeColors
              ]
            : primaryColor;

          return (
            <Link
              href={`/pokemon/${item.id}`}
              style={styles.cardWrapper}
            >
              <Link.Trigger>
              <View>
                <LinearGradient
                  colors={[primaryColor + "CC", secondaryColor + "CC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pokemonCard}
                >
                  {/* Pokemon ID */}
                  <Text style={styles.pokemonId}>
                    #{String(item.id).padStart(3, "0")}
                  </Text>

                  {/* Pokemon Image */}
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.sprites.front_default }}
                      style={styles.pokemonImage}
                    />
                  </View>

                  {/* Pokemon Info */}
                  <View style={styles.infoContainer}>
                    <Text style={styles.pokemonName} numberOfLines={1}>
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Text>

                    {/* Type Badges */}
                    <View style={styles.typesContainer}>
                      {item.types.slice(0, 2).map((type) => (
                        <View
                          key={type.slot}
                          style={[
                            styles.typeBadge,
                            {
                              backgroundColor:
                                pokemonTypeColors[
                                  type.type.name as keyof typeof pokemonTypeColors
                                ],
                            },
                          ]}
                        >
                          <Text style={styles.typeText} numberOfLines={1}>
                            {type.type.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Decorative Pokeball Background */}
                  <MaterialIcons
                    name="catching-pokemon"
                    size={80}
                    color="rgba(255, 255, 255, 0.1)"
                    style={styles.backgroundIcon}
                  />
                </LinearGradient>
              </View>
              </Link.Trigger>
              <Link.Preview />
            </Link>
          );
        }}
        keyExtractor={(item) => item.name}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={getPokemon}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={64} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No Pokémon found</Text>
          </View>
        }
      />
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
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    gap: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 16,
    marginBottom: 16,
  },
  cardWrapper: {
    flex: 1 / numColumns,
  },
  pokemonCard: {
    borderRadius: 20,
    padding: 16,
    aspectRatio: 1,
    position: "relative",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  pokemonId: {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    zIndex: 2,
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  pokemonImage: {
    width: cardWidth * 0.6,
    height: cardWidth * 0.6,
    zIndex: 2,
  },
  infoContainer: {
    gap: 8,
    zIndex: 2,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textTransform: "capitalize",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  typesContainer: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "white",
    textTransform: "capitalize",
  },
  backgroundIcon: {
    position: "absolute",
    bottom: -10,
    right: -10,
    zIndex: 1,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#94a3b8",
  },
});
