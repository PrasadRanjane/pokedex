import { MoveDetails, pokemonTypesColors } from "@/types/types";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@/contexts/ThemeContext";

export default function Index() {
  const [loading, setLoading] = useState(true);
    const [moves, setMoves] = useState<MoveDetails[]>([]);
  const [filteredMoves, setFilteredMoves] = useState<MoveDetails[]>([]);
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
        `https://pokeapi.co/api/v2/move?limit=${limit}&offset=${currentOffset}`
      );
      const data: {
        count: number;
        next: string | null;
        previous: string | null;
        results: {name: string, url: string}[]} = await res.json();
      const detailedMoves = await Promise.all(
        data.results.map(async (move) => {
          const res: Response = await fetch(move.url);
          const moveDetails: MoveDetails = await res.json();
          return {
            ...moveDetails,
            name: move.name,
            url: move.url,
          };
        })
      );
      console.log("detailedMoves", detailedMoves[0]);
      if (loadMore) {
        setMoves((prev) => [...prev, ...detailedMoves]);
        setLoadingMore(false);
      } else {
        setMoves(detailedMoves);
        setCount(data.count);
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
      setFilteredMoves(moves);
    } else {
      const filtered = moves.filter((move) =>
        move.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMoves(filtered);
    }
  }, [searchQuery, moves]);

  const handleLoadMore = () => {
    if (!loadingMore && !searchQuery) {
      setLoadingMore(true);
      getPokemon(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="catching-pokemon" size={64} color="#6366f1" />
        <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 20 }} />
        <Text style={styles.loadingText}>Loading Moves...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#10b981", "#14b8a6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="flash-on" size={40} color="white" />
            <Text style={styles.headerTitle}>Moves</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {count} Moves discovered
          </Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Moves..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons name="close" size={24} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Moves List */}
      <FlatList
        data={filteredMoves}
        renderItem={({ item }) => {
          const typeColor =
            pokemonTypeColors[
              item.type.name as keyof typeof pokemonTypeColors
            ] || colors.primary;

          return (
            <Link href={`/moves/${item.id}`} asChild>
              <TouchableOpacity style={styles.moveCard} activeOpacity={0.7}>
                <LinearGradient
                  colors={[typeColor + "15", typeColor + "05"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.moveCardGradient}
                >
                  {/* Move Icon */}
                  <View
                    style={[
                      styles.moveIconContainer,
                      { backgroundColor: typeColor + "20" },
                    ]}
                  >
                    <MaterialIcons name="flash-on" size={32} color={typeColor} />
                  </View>

                  {/* Move Info */}
                  <View style={styles.moveInfo}>
                    <Text style={styles.moveName} numberOfLines={1}>
                      {item.name
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Text>
                    <View style={styles.moveStats}>
                      <View
                        style={[styles.typeBadge, { backgroundColor: typeColor }]}
                      >
                        <Text style={styles.typeText}>{item.type.name}</Text>
                      </View>
                      {item.power && (
                        <View style={styles.statBadge}>
                          <MaterialIcons name="offline-bolt" size={14} color="#64748b" />
                          <Text style={styles.statText}>{item.power}</Text>
                        </View>
                      )}
                      {item.accuracy && (
                        <View style={styles.statBadge}>
                          <MaterialIcons name="my-location" size={14} color="#64748b" />
                          <Text style={styles.statText}>{item.accuracy}%</Text>
                        </View>
                      )}
                      {item.pp && (
                        <View style={styles.statBadge}>
                          <MaterialIcons name="autorenew" size={14} color="#64748b" />
                          <Text style={styles.statText}>{item.pp}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Arrow */}
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color="#94a3b8"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={getPokemon}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#10b981" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No Moves found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#64748b",
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
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
    zIndex: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 40,
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
    backgroundColor: "#f8fafc",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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
    color: "#1e293b",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  moveCard: {
    marginBottom: 12,
  },
  moveCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  moveIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  moveInfo: {
    flex: 1,
    gap: 8,
  },
  moveName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  moveStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    textTransform: "capitalize",
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
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
