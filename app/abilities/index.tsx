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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface AbilityDetails {
  id: number;
  name: string;
  generation: {
    name: string;
  };
}

export default function AbilitiesIndex() {
  const [loading, setLoading] = useState(true);
  const [abilities, setAbilities] = useState<AbilityDetails[]>([]);
  const [filteredAbilities, setFilteredAbilities] = useState<AbilityDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const limit = 20;

  const getAbilities = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset + limit : 0;
      const res = await fetch(
        `https://pokeapi.co/api/v2/ability?limit=${limit}&offset=${currentOffset}`
      );
      const data: {
        count: number;
        results: { name: string; url: string }[];
      } = await res.json();

      const detailedAbilities = await Promise.all(
        data.results.map(async (ability) => {
          const res = await fetch(ability.url);
          const abilityDetails: AbilityDetails = await res.json();
          return abilityDetails;
        })
      );

      if (loadMore) {
        setAbilities((prev) => [...prev, ...detailedAbilities]);
        setLoadingMore(false);
      } else {
        setAbilities(detailedAbilities);
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
    getAbilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredAbilities(abilities);
    } else {
      const filtered = abilities.filter((ability) =>
        ability.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAbilities(filtered);
    }
  }, [searchQuery, abilities]);

  const handleLoadMore = () => {
    if (!loadingMore && !searchQuery) {
      setLoadingMore(true);
      getAbilities(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="stars" size={64} color="#ec4899" />
        <ActivityIndicator size="large" color="#ec4899" style={{ marginTop: 20 }} />
        <Text style={styles.loadingText}>Loading Abilities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#ec4899", "#f43f5e"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="stars" size={40} color="white" />
            <Text style={styles.headerTitle}>Abilities</Text>
          </View>
          <Text style={styles.headerSubtitle}>{count} Abilities discovered</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Abilities..."
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

      <FlatList
        data={filteredAbilities}
        renderItem={({ item }) => (
          <Link href={`/abilities/${item.id}`} asChild>
            <TouchableOpacity style={styles.abilityCard} activeOpacity={0.7}>
              <LinearGradient
                colors={["#fce7f3", "#fff1f2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.abilityCardGradient}
              >
                <View style={styles.abilityIconContainer}>
                  <MaterialIcons name="stars" size={32} color="#ec4899" />
                </View>

                <View style={styles.abilityInfo}>
                  <Text style={styles.abilityName} numberOfLines={1}>
                    {item.name
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </Text>
                  <View style={styles.generationBadge}>
                    <Text style={styles.generationText}>
                      {item.generation.name.replace("generation-", "Gen ").toUpperCase()}
                    </Text>
                  </View>
                </View>

                <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
              </LinearGradient>
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#ec4899" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No Abilities found</Text>
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
  backButton: {
    position: "absolute",
    top: 60,
    left: 24,
    zIndex: 10,
  },
  headerContent: {
    gap: 8,
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
  abilityCard: {
    marginBottom: 12,
  },
  abilityCardGradient: {
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
  abilityIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  abilityInfo: {
    flex: 1,
    gap: 8,
  },
  abilityName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  generationBadge: {
    backgroundColor: "#ec4899",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  generationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
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

