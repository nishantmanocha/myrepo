import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  PSBColors,
  PSBSpacing,
  PSBShadows,
  PSBBorderRadius,
} from "../../../utils/PSBColors";
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeToggle from "../../../components/ThemeToggle";
import {
  Award,
  ChartBar as BarChart3,
  Brain,
  Calculator,
  ChevronRight,
  CreditCard,
  Eye,
  Flag,
  GraduationCap,
  Lock,
  Search,
  Shield,
  Smartphone,
  Target,
  TrendingUp,
  Sparkles,
  Star,
  Zap,
  CircleCheck as CheckCircle,
  Users,
} from "lucide-react-native";
import ChatbotButton from "../../../components/ChatbotButton";
import ChatbotPopup from "../../../components/ChatbotPopup";
import { router } from "expo-router";
import { useTheme } from "../../../contexts/ThemeContext";

const { width, height } = Dimensions.get("window");

const home = () => {
  const features = [
    {
      id: 1,
      title: "Simulators",
      description: "Interactive fraud scheme simulations",
      icon: Brain,
      color: PSBColors.primary.green,
      bgGradient: [PSBColors.background.primary, PSBColors.primary.lightGreen],
      route: "/(tabs)/simulator",
    },
    {
      id: 2,
      title: "Quizzes",
      description: "Test your fraud awareness skills",
      icon: Flag,
      color: PSBColors.status.warning,
      bgGradient: [PSBColors.background.primary, "#FEF3C7"],
      route: "/pages/QuizzesScreen",
    },
    {
      id: 3,
      title: "Decision Scenarios",
      description: "Practice secure decision making",
      icon: Target,
      color: PSBColors.status.error,
      bgGradient: [PSBColors.background.primary, "#FEE2E2"],
      route: "/pages/ScenarioHub",
    },
    {
      id: 4,
      title: "Education Center",
      description: "Trusted fraud prevention resources",
      icon: GraduationCap,
      color: PSBColors.secondary.blue,
      bgGradient: [PSBColors.background.primary, "#DBEAFE"],
      route: "/(app)/(tabs)/education",
    },
  ];

  const exploreTools = [
    {
      id: 1,
      title: "EMI Calculator",
      description: "Calculate loan EMIs with precision",
      icon: Calculator,
      color: PSBColors.primary.green,
      bgColor: PSBColors.primary.lightGreen,
      route: "/pages/FdAndRdCalculator",
      badge: "Popular",
    },
    {
      id: 2,
      title: "Tax Calculator",
      description: "Calculate your tax liability",
      icon: BarChart3,
      color: PSBColors.secondary.blue,
      bgColor: "#DBEAFE",
      route: "/pages/TaxCalculator",
    },
    {
      id: 3,
      title: "SIP Calculator",
      description: "Plan your investments smartly",
      icon: TrendingUp,
      color: PSBColors.status.success,
      bgColor: "#DCFCE7",
      route: "/pages/SipTool",
      badge: "New",
    },
    {
      id: 4,
      title: "URL Analyzer",
      description: "Check suspicious URLs",
      icon: Search,
      color: PSBColors.status.warning,
      bgColor: "#FEF3C7",
      route: "/pages/UrlAnalysisTool",
    },
  ];

  const ourSimulators = [
    {
      id: 1,
      title: "Phishing Simulator",
      description: "Master phishing detection techniques",
      icon: Smartphone,
      color: PSBColors.status.error,
      gradient: [PSBColors.status.error, "#F87171"],
      route: "/pages/PhishingSimulator",
      difficulty: "Beginner",
      completionRate: "94%",
    },
    {
      id: 2,
      title: "OTP Fraud",
      description: "Learn OTP scam prevention",
      icon: Lock,
      color: PSBColors.secondary.blue,
      gradient: [PSBColors.secondary.blue, "#60A5FA"],
      route: "/pages/identityTheftSimulator/index",
      difficulty: "Intermediate",
      completionRate: "87%",
    },
    {
      id: 3,
      title: "Loan Scams",
      description: "Identify fraudulent loan offers",
      icon: CreditCard,
      color: PSBColors.status.info,
      gradient: [PSBColors.status.info, "#60A5FA"],
      route: "/pages/loanScamSimulator/index",
      difficulty: "Advanced",
      completionRate: "76%",
    },
    {
      id: 4,
      title: "Lottery Fraud",
      description: "Spot fake lottery schemes",
      icon: Award,
      color: PSBColors.status.warning,
      gradient: [PSBColors.status.warning, "#FCD34D"],
      route: "/pages/lotteryFraudSimulator/index",
      difficulty: "Beginner",
      completionRate: "91%",
    },
  ];

  const stats = [
    {
      label: "Schemes Exposed",
      value: "50+",
      icon: Eye,
      color: PSBColors.status.error,
      bg: "#FEE2E2",
    },
    {
      label: "Users Protected",
      value: "10K+",
      icon: Shield,
      color: PSBColors.status.success,
      bg: "#DCFCE7",
    },
    {
      label: "Success Rate",
      value: "95%",
      icon: TrendingUp,
      color: PSBColors.secondary.blue,
      bg: "#DBEAFE",
    },
  ];

  const tips = [
    {
      title: "Secure Transactions",
      icon: "🔐",
      content:
        "Never share OTPs—even with bank employees. Banks will never ask for OTPs over phone.",
      gradient: [PSBColors.primary.lightGreen, "#F0FDF4"],
    },
    {
      title: "Verify URLs",
      icon: "🌐",
      content:
        "Always check URLs for HTTPS and correct spelling before entering sensitive information.",
      gradient: ["#DBEAFE", "#EFF6FF"],
    },
    {
      title: "Email Safety",
      icon: "📧",
      content:
        "Be cautious with email links. Verify sender authenticity before clicking any links.",
      gradient: ["#FEF3C7", "#FFFBEB"],
    },
  ];

  const dailyQuiz = {
    title: "Daily Challenge",
    description: "Test your fraud awareness knowledge",
    question: "What should you do if you receive an SMS asking for your OTP?",
    options: [
      "Share it immediately",
      "Ignore and delete the message",
      "Call the number back",
      "Forward to friends",
    ],
    correctAnswer: 1,
    icon: Sparkles,
    color: PSBColors.primary.green,
    bgGradient: [PSBColors.primary.lightGreen, "#F0FDF4"],
    route: "/pages/QuizzesScreen",
  };

  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { theme } = useTheme();
  const [isPopupVisible, setPopupVisible] = useState(false);

  // Animation values
  const headerAnim = useRef(new Animated.Value(-100)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const featuresAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.stagger(150, [
      Animated.spring(headerAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(statsAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(featuresAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation for sparkle icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // Wave animation for emoji
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: -15,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 15,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ])
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % tips.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * (width - 40),
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleOptionPress = (index: number) => {
    setSelectedOption(index);
    const correct = index === dailyQuiz.correctAnswer;
    setIsCorrect(correct);
  };

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(xOffset / (width - 40));
    setCurrentIndex(newIndex);
  };

  const handleCardPress = (route: string) => {
    router.push(route as any);
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  const AnimatedView = Animated.createAnimatedComponent(View);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const waveRotation = waveAnim.interpolate({
    inputRange: [-15, 15],
    outputRange: ["-15deg", "15deg"],
  });

  return (
    <LinearGradient
      colors={[PSBColors.background.primary, PSBColors.background.secondary]}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={PSBColors.primary.green}
        translucent
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          bounces={true}
        >
          {/* Enhanced PSB Header */}
          <AnimatedView
            style={[
              styles.header,
              {
                transform: [{ translateY: headerAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={[
                PSBColors.gradient.primary[0],
                PSBColors.gradient.primary[1],
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <View style={styles.headerContent}>
                <View style={styles.greetingWrapper}>
                  <View style={styles.greetingRow}>
                    <Text style={styles.greeting}>Welcome Back!</Text>
                    <Animated.Text
                      style={[
                        styles.waveEmoji,
                        { transform: [{ rotate: waveRotation }] },
                      ]}
                    >
                      👋
                    </Animated.Text>
                  </View>
                  <Text style={styles.subtitle}>
                    Stay protected with FinEduGuard
                  </Text>
                  <View style={styles.headerStats}>
                    <View style={styles.headerStatItem}>
                      <Star size={14} color={PSBColors.primary.gold} />
                      <Text style={styles.headerStatText}>PSB Certified</Text>
                    </View>
                    <View style={styles.headerStatItem}>
                      <Users size={14} color={PSBColors.primary.gold} />
                      <Text style={styles.headerStatText}>10K+ Protected</Text>
                    </View>
                  </View>
                </View>
                <ThemeToggle />
              </View>
            </LinearGradient>
          </AnimatedView>

          {/* Enhanced Stats Section with PSB Colors */}
          <AnimatedView
            style={[
              styles.statsContainer,
              {
                opacity: statsAnim,
                transform: [
                  {
                    scale: statsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Our Impact</Text>
            <View style={styles.statsRow}>
              {stats.map((stat, index) => (
                <AnimatedView
                  key={index}
                  style={[
                    styles.statCard,
                    { backgroundColor: stat.bg },
                    PSBShadows.md,
                  ]}
                >
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: stat.color + "20" },
                    ]}
                  >
                    <stat.icon size={28} color={stat.color} />
                  </View>
                  <Text style={[styles.statValue, { color: stat.color }]}>
                    {stat.value}
                  </Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </AnimatedView>
              ))}
            </View>
          </AnimatedView>

          {/* Enhanced Features Section with PSB Branding */}
          <AnimatedView
            style={[
              styles.featuresContainer,
              {
                transform: [{ translateY: featuresAnim }],
                opacity: scaleAnim,
              },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore Services</Text>
              <Text style={styles.sectionSubtitle}>
                Interactive learning tools
              </Text>
            </View>
            <View style={styles.featuresGrid}>
              {features.map((feature, index) => (
                <TouchableOpacity
                  key={feature.id}
                  style={[styles.featureCard, { borderColor: feature.color }]}
                  onPress={() => router.push(feature.route as any)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[feature.bgGradient[0], feature.bgGradient[1]]}
                    style={styles.featureGradient}
                  >
                    <View
                      style={[
                        styles.featureIconContainer,
                        { backgroundColor: feature.color + "15" },
                      ]}
                    >
                      <feature.icon size={32} color={feature.color} />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>
                      {feature.description}
                    </Text>
                    <View
                      style={[
                        styles.featureAccent,
                        { backgroundColor: feature.color },
                      ]}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </AnimatedView>

          {/* Enhanced Tools Section with PSB Colors */}
          <View style={styles.toolsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Smart Tools</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push("/(tabs)/tools")}
                activeOpacity={0.8}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color={PSBColors.primary.green} />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.toolsScroll}
            >
              {exploreTools.map((tool, index) => (
                <TouchableOpacity
                  key={tool.id}
                  style={[
                    styles.toolCard,
                    { backgroundColor: tool.bgColor },
                    PSBShadows.md,
                  ]}
                  onPress={() => handleCardPress(tool.route)}
                  activeOpacity={0.8}
                >
                  <View style={styles.toolHeader}>
                    <View
                      style={[
                        styles.toolIconContainer,
                        { backgroundColor: tool.color + "20" },
                      ]}
                    >
                      <tool.icon size={24} color={tool.color} />
                    </View>
                    {tool.badge && (
                      <View
                        style={[
                          styles.toolBadge,
                          { backgroundColor: tool.color },
                        ]}
                      >
                        <Text style={styles.toolBadgeText}>{tool.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.toolTitle, { color: tool.color }]}>
                    {tool.title}
                  </Text>
                  <Text style={styles.toolDescription}>{tool.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Enhanced Simulators Section with PSB Branding */}
          <View style={styles.simulatorsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Simulators</Text>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push("/(tabs)/simulator")}
                activeOpacity={0.8}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color={PSBColors.primary.green} />
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.simulatorsScroll}
            >
              {ourSimulators.map((simulator, index) => (
                <TouchableOpacity
                  key={simulator.id}
                  style={[styles.simulatorCard, PSBShadows.lg]}
                  onPress={() => handleCardPress(simulator.route)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[simulator.gradient[0], simulator.gradient[1]]}
                    style={styles.simulatorGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1.2, y: 1.2 }}
                  >
                    <View style={styles.simulatorHeader}>
                      <View style={styles.simulatorIconContainer}>
                        <simulator.icon
                          size={28}
                          color={PSBColors.text.inverse}
                        />
                      </View>
                      <View style={styles.difficultyBadge}>
                        <Text style={styles.difficultyText}>
                          {simulator.difficulty}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.simulatorContent}>
                      <Text style={styles.simulatorTitle}>
                        {simulator.title}
                      </Text>
                      <Text style={styles.simulatorDescription}>
                        {simulator.description}
                      </Text>
                    </View>
                    <View style={styles.simulatorFooter}>
                      <Text style={styles.completionRate}>
                        {simulator.completionRate} completion
                      </Text>
                      <Text style={styles.simulatorAction}>
                        Start Learning →
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Enhanced Daily Quiz with PSB Branding */}
          <View style={styles.quizContainer}>
            <Text style={styles.sectionTitle}>Daily Challenge</Text>
            <TouchableOpacity
              style={[styles.quizCard, PSBShadows.lg]}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[dailyQuiz.bgGradient[0], dailyQuiz.bgGradient[1]]}
                style={styles.quizGradient}
              >
                <View style={styles.quizHeader}>
                  <View style={styles.quizIconContainer}>
                    <Animated.View
                      style={{ transform: [{ rotate: rotation }] }}
                    >
                      <dailyQuiz.icon size={28} color={dailyQuiz.color} />
                    </Animated.View>
                  </View>
                  <View
                    style={[
                      styles.quizBadge,
                      { backgroundColor: PSBColors.primary.gold },
                    ]}
                  >
                    <Text style={styles.quizBadgeText}>TODAY</Text>
                  </View>
                </View>

                <View style={styles.quizContent}>
                  <Text style={styles.quizTitle}>{dailyQuiz.title}</Text>
                  <Text style={styles.quizDescription}>
                    {dailyQuiz.description}
                  </Text>

                  <View style={styles.quizQuestionContainer}>
                    <Text style={styles.quizQuestion}>
                      {dailyQuiz.question}
                    </Text>
                    <View style={styles.quizOptionsContainer}>
                      {dailyQuiz.options.map((option, index) => {
                        const isSelected = selectedOption === index;
                        const correct = index === dailyQuiz.correctAnswer;

                        return (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.quizOption,
                              isSelected &&
                                (isCorrect
                                  ? styles.correctOption
                                  : styles.wrongOption),
                              selectedOption !== null &&
                                !isCorrect &&
                                correct &&
                                styles.correctOption,
                            ]}
                            onPress={() => handleOptionPress(index)}
                            disabled={selectedOption !== null}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                styles.quizOptionText,
                                isSelected &&
                                  (isCorrect
                                    ? styles.correctOptionText
                                    : styles.wrongOptionText),
                                selectedOption !== null &&
                                  !isCorrect &&
                                  correct &&
                                  styles.correctOptionText,
                              ]}
                            >
                              {String.fromCharCode(65 + index)}. {option}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {selectedOption !== null && (
                      <View style={styles.feedbackContainer}>
                        <Text
                          style={[
                            styles.quizFeedbackText,
                            {
                              color: isCorrect
                                ? PSBColors.status.success
                                : PSBColors.status.error,
                            },
                          ]}
                        >
                          {isCorrect
                            ? "🎉 Perfect! You know how to stay safe!"
                            : "💡 Learn more in our comprehensive quizzes!"}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.takeQuizButton,
                            { backgroundColor: PSBColors.primary.green },
                          ]}
                          onPress={() => router.push(dailyQuiz.route)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.takeQuizButtonText}>
                            Take Full Quiz
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Enhanced Tips Carousel with PSB Colors */}
          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>Security Tips</Text>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tipsScroll}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {tips.map((tip, index) => (
                <View
                  key={index}
                  style={[styles.tipCard, { width: width - 40 }]}
                >
                  <LinearGradient
                    colors={[tip.gradient[0], tip.gradient[1]]}
                    style={[styles.tipGradient, PSBShadows.md]}
                  >
                    <View style={styles.tipIconContainer}>
                      <Text style={styles.tipIcon}>{tip.icon}</Text>
                    </View>
                    <View style={styles.tipContent}>
                      <Text style={styles.tipTitle}>{tip.title}</Text>
                      <Text style={styles.tipText}>{tip.content}</Text>
                    </View>
                  </LinearGradient>
                </View>
              ))}
            </ScrollView>

            {/* Pagination Dots with PSB Colors */}
            <View style={styles.paginationContainer}>
              {tips.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentIndex === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <ChatbotButton onPress={() => setPopupVisible(true)} />
        <ChatbotPopup
          visible={isPopupVisible}
          onClose={() => setPopupVisible(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Enhanced Header with PSB Branding
  header: {
    marginBottom: PSBSpacing.lg,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: PSBSpacing.lg,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greetingWrapper: {
    flex: 1,
    paddingRight: 15,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: PSBSpacing.sm,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: PSBColors.primary.gold,
    marginRight: 10,
  },
  waveEmoji: {
    fontSize: 28,
    marginLeft: 5,
  },
  subtitle: {
    fontSize: 16,
    color: PSBColors.text.inverse,
    marginBottom: 15,
    fontWeight: "400",
    opacity: 0.95,
  },
  headerStats: {
    flexDirection: "row",
    gap: 20,
  },
  headerStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerStatText: {
    color: PSBColors.text.inverse,
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.9,
  },

  // Enhanced Stats with PSB Colors
  statsContainer: {
    paddingHorizontal: PSBSpacing.lg,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: PSBColors.text.accent,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: PSBColors.text.secondary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: PSBBorderRadius.xl,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: PSBColors.border.primary,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: PSBColors.text.secondary,
    textAlign: "center",
    fontWeight: "500",
  },

  // Enhanced Features with PSB Branding
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  featureCard: {
    width: (width - 56) / 2,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    borderWidth: 0.5,
  },
  featureGradient: {
    padding: 24,
    alignItems: "center",
    minHeight: 180,
    justifyContent: "center",
    position: "relative",
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: PSBColors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: PSBColors.text.secondary,
    textAlign: "center",
    lineHeight: 16,
  },
  featureAccent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },

  // Enhanced Tools with PSB Colors
  toolsContainer: {
    paddingHorizontal: PSBSpacing.lg,
    marginBottom: 40,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: PSBBorderRadius.xl,
    backgroundColor: PSBColors.background.surface,
    borderWidth: 1,
    borderColor: PSBColors.border.accent,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: PSBColors.primary.green,
    marginRight: 4,
  },
  toolsScroll: {
    paddingRight: 20,
  },
  toolCard: {
    width: 160,
    height: 180,
    marginRight: 16,
    borderRadius: PSBBorderRadius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: PSBColors.border.primary,
  },
  toolHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  toolIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  toolBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: PSBBorderRadius.lg,
  },
  toolBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: PSBColors.text.inverse,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 12,
    color: PSBColors.text.secondary,
    lineHeight: 16,
  },

  // Enhanced Simulators with PSB Colors
  simulatorsContainer: {
    paddingHorizontal: PSBSpacing.lg,
    marginBottom: 40,
  },
  simulatorsScroll: {
    paddingRight: 20,
  },
  simulatorCard: {
    width: 280,
    height: 220,
    marginRight: 20,
    borderRadius: 24,
    overflow: "hidden",
  },
  simulatorGradient: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  simulatorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  simulatorIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: PSBBorderRadius.lg,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
    color: PSBColors.text.inverse,
  },
  simulatorContent: {
    flex: 1,
    paddingVertical: 16,
  },
  simulatorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: PSBColors.text.inverse,
    marginBottom: 8,
  },
  simulatorDescription: {
    fontSize: 14,
    color: PSBColors.text.inverse,
    lineHeight: 20,
    opacity: 0.9,
  },
  simulatorFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  completionRate: {
    fontSize: 12,
    color: PSBColors.text.inverse,
    fontWeight: "500",
    opacity: 0.8,
  },
  simulatorAction: {
    fontSize: 14,
    fontWeight: "600",
    color: PSBColors.text.inverse,
  },

  // Enhanced Quiz with PSB Branding
  quizContainer: {
    paddingHorizontal: PSBSpacing.lg,
    marginBottom: 40,
  },
  quizCard: {
    borderRadius: 24,
    overflow: "hidden",
  },
  quizGradient: {
    padding: 24,
  },
  quizHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  quizIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PSBColors.background.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  quizBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: PSBBorderRadius.lg,
  },
  quizBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: PSBColors.text.inverse,
  },
  quizContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: PSBColors.text.accent,
    marginBottom: 8,
  },
  quizDescription: {
    fontSize: 14,
    color: PSBColors.text.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  quizQuestionContainer: {
    marginBottom: 16,
  },
  quizQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: PSBColors.text.primary,
    marginBottom: 16,
    lineHeight: 24,
  },
  quizOptionsContainer: {
    gap: 12,
  },
  quizOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: PSBColors.background.primary,
    borderRadius: PSBBorderRadius.lg,
    borderWidth: 2,
    borderColor: PSBColors.border.primary,
    ...PSBShadows.sm,
  },
  quizOptionText: {
    fontSize: 14,
    color: PSBColors.text.primary,
    lineHeight: 20,
    fontWeight: "500",
  },
  correctOption: {
    backgroundColor: "#DCFCE7",
    borderColor: PSBColors.status.success,
  },
  wrongOption: {
    backgroundColor: "#FEE2E2",
    borderColor: PSBColors.status.error,
  },
  correctOptionText: {
    color: PSBColors.status.success,
    fontWeight: "600",
  },
  wrongOptionText: {
    color: PSBColors.status.error,
    fontWeight: "600",
  },
  feedbackContainer: {
    marginTop: 16,
    alignItems: "center",
    gap: 12,
  },
  quizFeedbackText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },
  takeQuizButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: PSBBorderRadius.lg,
    ...PSBShadows.sm,
  },
  takeQuizButtonText: {
    color: PSBColors.text.inverse,
    fontSize: 14,
    fontWeight: "600",
  },

  // Enhanced Tips with PSB Colors
  tipsContainer: {
    paddingHorizontal: PSBSpacing.lg,
    marginBottom: 40,
  },
  tipsScroll: {
    paddingRight: 20,
  },
  tipCard: {
    marginRight: 20,
    borderRadius: PSBBorderRadius.xl,
    overflow: "hidden",
  },
  tipGradient: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 120,
    borderRadius: PSBBorderRadius.xl,
  },
  tipIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    ...PSBShadows.sm,
  },
  tipIcon: {
    fontSize: 28,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: PSBColors.text.accent,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: PSBColors.text.primary,
    lineHeight: 18,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PSBColors.border.secondary,
  },
  paginationDotActive: {
    backgroundColor: PSBColors.primary.green,
    width: 24,
  },
});

export default home;
