import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "@/contexts/ThemeContext";

interface Category {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  colors: [string, string];
  route?: string;
  description: string;
}

const categories: Category[] = [
  {
    id: "pokemon",
    title: "Pokémon",
    icon: "catching-pokemon",
    colors: ["#6366f1", "#8b5cf6"],
    route: "/pokemon",
    description: "Browse all Pokémon",
  },
  {
    id: "items",
    title: "Items",
    icon: "inventory-2",
    colors: ["#f59e0b", "#f97316"],
    route: "/items",
    description: "Explore items",
  },
  {
    id: "moves",
    title: "Moves",
    icon: "flash-on",
    route: "/moves",
    colors: ["#10b981", "#14b8a6"],
    description: "Discover moves",
  },
  {
    id: "abilities",
    title: "Abilities",
    icon: "stars",
    colors: ["#ec4899", "#f43f5e"],
    route: "/abilities",
    description: "View abilities",
  },
  {
    id: "types",
    title: "Types",
    icon: "category",
    colors: ["#8b5cf6", "#a855f7"],
    route: "/types",
    description: "Explore types",
  },
  {
    id: "favorites",
    title: "Favorites",
    icon: "favorite",
    colors: ["#ef4444", "#dc2626"],
    description: "Your favorites",
  },
];

export default function Index() {
  const [search, setSearch] = useState("");
  const { colors, isDark, toggleTheme } = useTheme();

  const handleCategoryPress = (category: Category) => {
    if (category.route) {
      router.push(category.route as any);
    } else {
      console.log(`Navigate to ${category.id}`);
    }
  };

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/pokemon/${search.toLowerCase().trim()}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        {/* Theme Toggle Button */}
        <TouchableOpacity 
          style={styles.themeToggle} 
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name={isDark ? "light-mode" : "dark-mode"} 
            size={28} 
            color="white" 
          />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="catching-pokemon" size={48} color="white" />
          </View>
          <Text style={styles.headerTitle}>Pokédex</Text>
          <Text style={styles.headerSubtitle}>
            Your Ultimate Pokémon Companion
          </Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={[styles.searchLabel, { color: colors.text }]}>What are you looking for?</Text>
          <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="search" size={24} color={colors.textTertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search for a Pokémon..."
              placeholderTextColor={colors.textTertiary}
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {search !== "" && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <MaterialIcons name="close" size={24} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="catching-pokemon" size={32} color={colors.primary} />
            <Text style={[styles.statNumber, { color: colors.text }]}>1000+</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pokémon</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="category" size={32} color={colors.primary} />
            <Text style={[styles.statNumber, { color: colors.text }]}>18</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Types</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <MaterialIcons name="flash-on" size={32} color={colors.accent} />
            <Text style={[styles.statNumber, { color: colors.text }]}>800+</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Moves</Text>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Explore</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category)}
                style={styles.categoryCardWrapper}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={category.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryCard}
                >
                  <View style={styles.categoryIconContainer}>
                    <MaterialIcons
                      name={category.icon}
                      size={40}
                      color="white"
                    />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    <Text style={styles.categoryDescription}>
                      {category.description}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="arrow-forward"
                    size={24}
                    color="rgba(255, 255, 255, 0.8)"
                    style={styles.categoryArrow}
                  />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured</Text>
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => router.push("/pokemon")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#3b82f6", "#1d4ed8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredContent}>
                <MaterialIcons
                  name="catching-pokemon"
                  size={64}
                  color="rgba(255, 255, 255, 0.2)"
                  style={styles.featuredIcon}
                />
                <View style={styles.featuredTextContainer}>
                  <Text style={styles.featuredTitle}>Complete Pokédex</Text>
                  <Text style={styles.featuredSubtitle}>
                    Discover all Pokémon from every generation
                  </Text>
                  <View style={styles.featuredButton}>
                    <Text style={styles.featuredButtonText}>Explore Now</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="#3b82f6" />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  themeToggle: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 10,
  },
  headerContent: {
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  searchLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
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
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  categoriesSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCardWrapper: {
    width: "100%",
  },
  categoryCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 90,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  categoryArrow: {
    marginLeft: 12,
  },
  featuredSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  featuredCard: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  featuredGradient: {
    padding: 24,
  },
  featuredContent: {
    position: "relative",
  },
  featuredIcon: {
    position: "absolute",
    top: -10,
    right: -10,
  },
  featuredTextContainer: {
    gap: 12,
  },
  featuredTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
  featuredSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 22,
  },
  featuredButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 8,
    gap: 8,
  },
  featuredButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3b82f6",
  },
});
