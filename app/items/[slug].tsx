import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

interface ItemDetail {
  id: number;
  name: string;
  cost: number;
  category: { name: string };
  attributes: { name: string }[];
  effect_entries: { effect: string; language: { name: string } }[];
  flavor_text_entries: { text: string; language: { name: string } }[];
  sprites: { default: string };
}

export default function ItemDetailScreen() {
  const [loading, setLoading] = useState(true);
  const { slug } = useLocalSearchParams();
  const [item, setItem] = useState<ItemDetail | null>(null);

  useEffect(() => {
    async function getItem() {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/item/${slug}`);
        const data = await res.json();
        setItem(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getItem();
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  const effectText =
    item.effect_entries?.find((entry) => entry.language.name === "en")
      ?.effect || "No description available";

  const flavorText =
    item.flavor_text_entries?.find((entry) => entry.language.name === "en")
      ?.text || "";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#f59e0b", "#f97316"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <Text style={styles.itemId}>#{String(item.id).padStart(4, "0")}</Text>

          {item.sprites?.default ? (
            <Image
              source={{ uri: item.sprites.default }}
              style={styles.itemImage}
            />
          ) : (
            <MaterialIcons name="inventory-2" size={120} color="white" />
          )}

          <Text style={styles.itemName}>
            {item.name
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Text>

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {item.category.name.replace(/-/g, " ")}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {item.cost > 0 && (
            <View style={styles.costSection}>
              <MaterialIcons name="monetization-on" size={32} color="#f59e0b" />
              <Text style={styles.costValue}>₽{item.cost.toLocaleString()}</Text>
            </View>
          )}

          {flavorText && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{flavorText}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Effect</Text>
            <Text style={styles.effectText}>{effectText}</Text>
          </View>

          {item.attributes && item.attributes.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Attributes</Text>
              <View style={styles.attributesContainer}>
                {item.attributes.map((attr, index) => (
                  <View key={index} style={styles.attributeBadge}>
                    <Text style={styles.attributeText}>
                      {attr.name.replace(/-/g, " ")}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
  errorText: {
    fontSize: 18,
    color: "#64748b",
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
  itemId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 10,
  },
  itemImage: {
    width: 120,
    height: 120,
    marginVertical: 20,
  },
  itemName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 20,
    textTransform: "capitalize",
  },
  categoryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  contentContainer: {
    padding: 20,
  },
  costSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef3c7",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    gap: 12,
  },
  costValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f59e0b",
  },
  section: {
    backgroundColor: "white",
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
    color: "#1e293b",
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#475569",
  },
  effectText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748b",
  },
  attributesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  attributeBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  attributeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f59e0b",
    textTransform: "capitalize",
  },
});

