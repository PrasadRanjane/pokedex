import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router, Link } from "expo-router";
import { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { PokemonDetailsByURL } from "@/types/types";

interface TypeDetail {
  id: number;
  name: string;
  damage_relations: {
    double_damage_from: { name: string }[];
    double_damage_to: { name: string }[];
    half_damage_from: { name: string }[];
    half_damage_to: { name: string }[];
    no_damage_from: { name: string }[];
    no_damage_to: { name: string }[];
  };
  pokemon: { pokemon: { name: string; url: string } }[];
}

export default function TypeDetailScreen() {
  const [loading, setLoading] = useState(true);
  const { slug } = useLocalSearchParams();
  const [type, setType] = useState<TypeDetail | null>(null);
  const { colors, isDark, pokemonTypeColors } = useTheme();

  useEffect(() => {
    async function getType() {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${slug}`);
        const data = await res.json();
        setType(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getType();
  }, [slug]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!type) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>Type not found</Text>
      </View>
    );
  }

  const typeColor =
    pokemonTypeColors[type.name as keyof typeof pokemonTypeColors] || colors.primary;

  const renderTypeBadges = (types: { name: string }[], color: string) => (
    <View style={styles.typesGrid}>
      {types.map((t, index) => (
        <View
          key={index}
          style={[
            styles.typeBadge,
            {
              backgroundColor:
                pokemonTypeColors[t.name as keyof typeof pokemonTypeColors] ||
                color,
            },
          ]}
        >
          <Text style={styles.typeBadgeText}>{t.name.toUpperCase()}</Text>
        </View>
      ))}
      {types.length === 0 && (
        <Text style={[styles.noneText, { color: colors.textTertiary }]}>None</Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[typeColor, typeColor + "DD"]}
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

          <View style={styles.iconContainer}>
            <MaterialIcons name="catching-pokemon" size={100} color="white" />
          </View>

          <Text style={styles.typeName}>{type.name.toUpperCase()}</Text>
          <Text style={styles.subtitle}>{type.pokemon.length} Pokémon</Text>
        </LinearGradient>

        <View style={styles.contentContainer}>
          {/* Damage Relations */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>⚔️ Attack Effectiveness</Text>
            
            <View style={styles.damageSection}>
              <Text style={[styles.damageLabel, { color: colors.textSecondary }]}>Super Effective Against (2x)</Text>
              {renderTypeBadges(type.damage_relations.double_damage_to, "#10b981")}
            </View>

            <View style={styles.damageSection}>
              <Text style={[styles.damageLabel, { color: colors.textSecondary }]}>Not Very Effective Against (0.5x)</Text>
              {renderTypeBadges(type.damage_relations.half_damage_to, "#f59e0b")}
            </View>

            <View style={styles.damageSection}>
              <Text style={[styles.damageLabel, { color: colors.textSecondary }]}>No Effect Against (0x)</Text>
              {renderTypeBadges(type.damage_relations.no_damage_to, "#64748b")}
            </View>
          </View>

          {/* Defense */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🛡️ Defense Effectiveness</Text>
            
            <View style={styles.damageSection}>
              <Text style={[styles.damageLabel, { color: colors.textSecondary }]}>Weak To (2x damage taken)</Text>
              {renderTypeBadges(type.damage_relations.double_damage_from, "#ef4444")}
            </View>

            <View style={styles.damageSection}>
              <Text style={[styles.damageLabel, { color: colors.textSecondary }]}>Resistant To (0.5x damage taken)</Text>
              {renderTypeBadges(type.damage_relations.half_damage_from, "#10b981")}
            </View>

            <View style={styles.damageSection}>
              <Text style={[styles.damageLabel, { color: colors.textSecondary }]}>Immune To (0x damage taken)</Text>
              {renderTypeBadges(type.damage_relations.no_damage_from, "#64748b")}
            </View>
          </View>

          {/* Pokemon List */}
          {type.pokemon.length > 0 && (
            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Pokémon ({type.pokemon.length})
              </Text>
              <View style={styles.pokemonGrid}>
                {type.pokemon.map((p, index) => {
                  // Extract pokemon ID from URL: https://pokeapi.co/api/v2/pokemon/1/
                  const pokemonId = p.pokemon.url.split("/").filter(Boolean).pop();     
                  return (
                    <Link key={index} href={`/pokemon/${pokemonId}`} asChild  style={[styles.pokemonBadge, { backgroundColor: colors.surfaceVariant }]} >
                      <TouchableOpacity 
                       
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.pokemonName, { color: colors.text }]}>
                          {p.pokemon.name
                            .split("-")
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </Text>
                        <MaterialIcons name="chevron-right" size={16} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </Link>
                  );
                })}
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
  iconContainer: {
    marginVertical: 20,
  },
  typeName: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  damageSection: {
    marginBottom: 16,
  },
  damageLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  typesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
  },
  noneText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  pokemonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pokemonBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pokemonName: {
    fontSize: 14,
    fontWeight: "600",
  },
  moreText: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

