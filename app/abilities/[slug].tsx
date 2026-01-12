import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

interface AbilityDetail {
  id: number;
  name: string;
  generation: { name: string };
  effect_entries: { effect: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
  pokemon: { pokemon: { name: string } }[];
}

export default function AbilityDetailScreen() {
  const [loading, setLoading] = useState(true);
  const { slug } = useLocalSearchParams();
  const [ability, setAbility] = useState<AbilityDetail | null>(null);

  useEffect(() => {
    async function getAbility() {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/ability/${slug}`);
        const data = await res.json();
        setAbility(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getAbility();
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec4899" />
      </View>
    );
  }

  if (!ability) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Ability not found</Text>
      </View>
    );
  }

  const effectText =
    ability.effect_entries?.find((entry) => entry.language.name === "en")
      ?.effect || "No description available";

  const flavorText =
    ability.flavor_text_entries?.find((entry) => entry.language.name === "en")
      ?.flavor_text || "";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#ec4899", "#f43f5e"]}
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

          <Text style={styles.abilityId}>#{String(ability.id).padStart(3, "0")}</Text>

          <View style={styles.iconContainer}>
            <MaterialIcons name="stars" size={80} color="white" />
          </View>

          <Text style={styles.abilityName}>
            {ability.name
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Text>

          <View style={styles.generationBadge}>
            <Text style={styles.generationText}>
              {ability.generation.name.replace("generation-", "Gen ").toUpperCase()}
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {flavorText && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>
                {flavorText.replace(/\f/g, " ")}
              </Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Effect</Text>
            <Text style={styles.effectText}>{effectText}</Text>
          </View>

          {ability.pokemon && ability.pokemon.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Pokémon with this Ability ({ability.pokemon.length})
              </Text>
              <View style={styles.pokemonGrid}>
                {ability.pokemon.slice(0, 20).map((p, index) => (
                  <View key={index} style={styles.pokemonBadge}>
                    <Text style={styles.pokemonName}>
                      {p.pokemon.name
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Text>
                  </View>
                ))}
                {ability.pokemon.length > 20 && (
                  <Text style={styles.moreText}>
                    +{ability.pokemon.length - 20} more
                  </Text>
                )}
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
  abilityId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 10,
  },
  iconContainer: {
    marginVertical: 20,
  },
  abilityName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 20,
  },
  generationBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  generationText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 20,
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
  pokemonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pokemonBadge: {
    backgroundColor: "#fce7f3",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pokemonName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ec4899",
  },
  moreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

