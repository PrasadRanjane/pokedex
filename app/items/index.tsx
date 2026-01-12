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
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface ItemDetails {
  id: number;
  name: string;
  cost: number;
  category: {
    name: string;
  };
  sprites: {
    default: string;
  };
}

export default function ItemsIndex() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ItemDetails[]>([]);
  const [filteredItems, setFilteredItems] = useState<ItemDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const limit = 20;

  const getItems = async (loadMore = false) => {
    try {
      const currentOffset = loadMore ? offset + limit : 0;
      const res = await fetch(
        `https://pokeapi.co/api/v2/item?limit=${limit}&offset=${currentOffset}`
      );
      const data: {
        count: number;
        results: { name: string; url: string }[];
      } = await res.json();
      
      const detailedItems = await Promise.all(
        data.results.map(async (item) => {
          const res = await fetch(item.url);
          const itemDetails: ItemDetails = await res.json();
          return itemDetails;
        })
      );

      if (loadMore) {
        setItems((prev) => [...prev, ...detailedItems]);
        setLoadingMore(false);
      } else {
        setItems(detailedItems);
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
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  const handleLoadMore = () => {
    if (!loadingMore && !searchQuery) {
      setLoadingMore(true);
      getItems(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="inventory-2" size={64} color="#f59e0b" />
        <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 20 }} />
        <Text style={styles.loadingText}>Loading Items...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#f59e0b", "#f97316"]}
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
            <MaterialIcons name="inventory-2" size={40} color="white" />
            <Text style={styles.headerTitle}>Items</Text>
          </View>
          <Text style={styles.headerSubtitle}>{count} Items discovered</Text>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={24} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Items..."
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

      {/* Items List */}
      <FlatList
        data={filteredItems}
        renderItem={({ item }) => (
          <Link href={`/items/${item.id}`} asChild>
            <TouchableOpacity style={styles.itemCard} activeOpacity={0.7}>
              <LinearGradient
                colors={["#fef3c7", "#fffbeb"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.itemCardGradient}
              >
                {/* Item Image */}
                <View style={styles.itemImageContainer}>
                  {item.sprites?.default ? (
                    <Image
                      source={{ uri: item.sprites.default }}
                      style={styles.itemImage}
                    />
                  ) : (
                    <MaterialIcons name="inventory-2" size={48} color="#f59e0b" />
                  )}
                </View>

                {/* Item Info */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </Text>
                  <View style={styles.itemStats}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>
                        {item.category.name.replace(/-/g, " ")}
                      </Text>
                    </View>
                    {item.cost > 0 && (
                      <View style={styles.costBadge}>
                        <MaterialIcons name="monetization-on" size={14} color="#f59e0b" />
                        <Text style={styles.costText}>₽{item.cost}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Arrow */}
                <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
              </LinearGradient>
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={getItems}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#f59e0b" />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={64} color="#cbd5e1" />
            <Text style={styles.emptyText}>No Items found</Text>
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
  itemCard: {
    marginBottom: 12,
  },
  itemCardGradient: {
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
  itemImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 48,
    height: 48,
  },
  itemInfo: {
    flex: 1,
    gap: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    textTransform: "capitalize",
  },
  itemStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  categoryBadge: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    textTransform: "capitalize",
  },
  costBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  costText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f59e0b",
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

