import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@/contexts/ThemeContext";

interface TypeDetails {
  id: number;
  name: string;
}

export default function TypesIndex() {
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<TypeDetails[]>([]);
  const { colors, isDark, pokemonTypeColors } = useTheme();

  useEffect(() => {
    async function getTypes() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/type");
        const data: { results: { name: string; url: string }[] } = await res.json();

        const detailedTypes = await Promise.all(
          data.results
            .filter((type) => type.name !== "unknown" && type.name !== "shadow")
            .map(async (type) => {
              const res = await fetch(type.url);
              const typeDetails: TypeDetails = await res.json();
              return typeDetails;
            })
        );

        setTypes(detailedTypes);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    getTypes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="category" size={64} color="#8b5cf6" />
        <ActivityIndicator size="large" color="#8b5cf6" style={{ marginTop: 20 }} />
        <Text style={styles.loadingText}>Loading Types...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8b5cf6", "#a855f7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <MaterialIcons name="category" size={40} color="white" />
            <Text style={styles.headerTitle}>Types</Text>
          </View>
          <Text style={styles.headerSubtitle}>{types.length} Types</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={types}
        numColumns={2}
        key={2}
        renderItem={({ item }) => {
          const typeColor =
            pokemonTypeColors[item.name as keyof typeof pokemonTypeColors] ||
            colors.primary;

          return (
            <Link href={`/types/${item.id}`} asChild>
              <TouchableOpacity style={styles.typeCardWrapper} activeOpacity={0.8}>
                <LinearGradient
                  colors={[typeColor, typeColor + "DD"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.typeCard}
                >
                  <MaterialIcons name="catching-pokemon" size={48} color="white" />
                  <Text style={styles.typeName}>{item.name.toUpperCase()}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  columnWrapper: {
    gap: 16,
    marginBottom: 16,
  },
  typeCardWrapper: {
    flex: 1,
  },
  typeCard: {
    borderRadius: 20,
    padding: 24,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  typeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

