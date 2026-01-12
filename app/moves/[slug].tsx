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
import { MoveDetailsById } from "@/types/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";

export default function MoveScreen() {
  const [loading, setLoading] = useState(true);
  const { slug } = useLocalSearchParams();
  const [move, setMove] = useState<MoveDetailsById | null>(null);
  const { colors, isDark, pokemonTypeColors } = useTheme();

  useEffect(() => {
    async function getMove() {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/move/${slug}`);
        const data = await res.json();
        setMove(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    
    getMove();
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!move) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Move not found</Text>
      </View>
    );
  }

  const typeColor =
    pokemonTypeColors[move.type.name as keyof typeof pokemonTypeColors] ||
    colors.primary;

  const damageClassIcons: { [key: string]: keyof typeof MaterialIcons.glyphMap } = {
    physical: "fitness-center",
    special: "auto-awesome",
    status: "healing",
  };

  const effectText = move.effect_entries?.find(
    (entry) => entry.language.name === "en"
  )?.effect || "No description available";

  const flavorText = move.flavor_text_entries?.find(
    (entry) => entry.language.name === "en"
  )?.flavor_text || "";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={[typeColor, typeColor + "DD"]}
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

          {/* Move ID */}
          <Text style={styles.moveId}>#{String(move.id).padStart(3, "0")}</Text>

          {/* Move Icon */}
          <View style={styles.moveIconContainer}>
            <MaterialIcons name="flash-on" size={80} color="white" />
          </View>

          {/* Move Name */}
          <Text style={styles.moveName}>
            {move.name
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Text>

          {/* Type Badge */}
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            ]}
          >
            <Text style={styles.typeText}>{move.type.name.toUpperCase()}</Text>
          </View>
        </LinearGradient>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Quick Stats */}
          <View style={styles.quickStatsSection}>
            <View style={styles.quickStatCard}>
              <MaterialIcons name="offline-bolt" size={28} color={typeColor} />
              <Text style={styles.quickStatLabel}>Power</Text>
              <Text style={styles.quickStatValue}>
                {move.power || "—"}
              </Text>
            </View>
            <View style={styles.quickStatCard}>
              <MaterialIcons name="my-location" size={28} color={typeColor} />
              <Text style={styles.quickStatLabel}>Accuracy</Text>
              <Text style={styles.quickStatValue}>
                {move.accuracy ? `${move.accuracy}%` : "—"}
              </Text>
            </View>
            <View style={styles.quickStatCard}>
              <MaterialIcons name="autorenew" size={28} color={typeColor} />
              <Text style={styles.quickStatLabel}>PP</Text>
              <Text style={styles.quickStatValue}>{move.pp || "—"}</Text>
            </View>
          </View>

          {/* Description Section */}
          {flavorText && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>
                {flavorText.replace(/\f/g, " ")}
              </Text>
            </View>
          )}

          {/* Effect Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Effect</Text>
            <Text style={styles.effectText}>
              {effectText.replace(/\$effect_chance/g, String(move.effect_chance || 0))}
            </Text>
          </View>

          {/* Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Damage Class</Text>
                <View style={styles.detailValueContainer}>
                  <MaterialIcons
                    name={
                      damageClassIcons[
                        move.damage_class?.name || "status"
                      ] || "help-outline"
                    }
                    size={20}
                    color={typeColor}
                  />
                  <Text style={styles.detailValue}>
                    {move.damage_class?.name
                      ? move.damage_class.name.charAt(0).toUpperCase() +
                        move.damage_class.name.slice(1)
                      : "—"}
                  </Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Priority</Text>
                <Text style={styles.detailValue}>
                  {move.priority !== undefined ? move.priority : "—"}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Target</Text>
                <Text style={styles.detailValue}>
                  {move.target?.name
                    ?.split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ") || "—"}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Effect Chance</Text>
                <Text style={styles.detailValue}>
                  {move.effect_chance ? `${move.effect_chance}%` : "—"}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Generation</Text>
                <Text style={styles.detailValue}>
                  {move.generation?.name
                    ?.replace("generation-", "Gen ")
                    .toUpperCase() || "—"}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Contest Type</Text>
                <Text style={styles.detailValue}>
                  {move.contest_type?.name
                    ? move.contest_type.name.charAt(0).toUpperCase() +
                      move.contest_type.name.slice(1)
                    : "—"}
                </Text>
              </View>
            </View>
          </View>

          {/* Additional Info */}
          {move.meta && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.metaInfoContainer}>
                {move.meta.ailment && move.meta.ailment.name !== "none" && (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="local-hospital" size={20} color="#ef4444" />
                    <View style={styles.metaTextContainer}>
                      <Text style={styles.metaLabel}>Ailment</Text>
                      <Text style={styles.metaValue}>
                        {move.meta.ailment.name
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Text>
                    </View>
                  </View>
                )}

                {move.meta.category && (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="category" size={20} color="#8b5cf6" />
                    <View style={styles.metaTextContainer}>
                      <Text style={styles.metaLabel}>Category</Text>
                      <Text style={styles.metaValue}>
                        {move.meta.category.name
                          .split("-")
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(" ")}
                      </Text>
                    </View>
                  </View>
                )}

                {move.meta.crit_rate !== undefined && move.meta.crit_rate > 0 && (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="stars" size={20} color="#f59e0b" />
                    <View style={styles.metaTextContainer}>
                      <Text style={styles.metaLabel}>Critical Hit Rate</Text>
                      <Text style={styles.metaValue}>+{move.meta.crit_rate}</Text>
                    </View>
                  </View>
                )}

                {move.meta.drain !== undefined && move.meta.drain !== 0 && (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="water-drop" size={20} color="#3b82f6" />
                    <View style={styles.metaTextContainer}>
                      <Text style={styles.metaLabel}>Drain</Text>
                      <Text style={styles.metaValue}>{move.meta.drain}%</Text>
                    </View>
                  </View>
                )}

                {move.meta.healing !== undefined && move.meta.healing !== 0 && (
                  <View style={styles.metaItem}>
                    <MaterialIcons name="favorite" size={20} color="#ec4899" />
                    <View style={styles.metaTextContainer}>
                      <Text style={styles.metaLabel}>Healing</Text>
                      <Text style={styles.metaValue}>{move.meta.healing}%</Text>
                    </View>
                  </View>
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
  moveId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 10,
  },
  moveIconContainer: {
    marginVertical: 20,
  },
  moveName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 20,
  },
  typeBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  typeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 20,
  },
  quickStatsSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  quickStatLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
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
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  detailValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaInfoContainer: {
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  metaTextContainer: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
});
