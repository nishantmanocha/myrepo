import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PSBColors } from '../utils/PSBColors';
import * as Animatable from 'react-native-animatable';
import { Award, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface Badge {
  name: string;
  description: string;
  icon: string;
  color: string;
  xpReward?: number;
}

interface BadgeUnlockModalProps {
  visible: boolean;
  badge: Badge | null;
  onClose: () => void;
}

const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({
  visible,
  badge,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && badge) {
      // Vibrate when badge is unlocked
      Vibration.vibrate([0, 200, 100, 200]);
      
      // Animate modal entrance
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start();

      // Rotate animation for the badge
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0);
      confettiAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible, badge]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const confettiInterpolate = confettiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  if (!badge) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Confetti Animation */}
        <Animated.View
          style={[
            styles.confettiContainer,
            {
              opacity: confettiInterpolate,
            },
          ]}
        >
          {[...Array(20)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.confetti,
                {
                  backgroundColor: [
                    '#ff6b6b',
                    '#4ecdc4',
                    '#45b7d1',
                    '#96ceb4',
                    '#ffd93d',
                    '#ff9ff3',
                    '#54a0ff',
                    '#5f27cd',
                  ][index % 8],
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 1000}ms`,
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Main Modal Content */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[PSBColors.primary.green, '#006B4F']}
            style={styles.modalHeader}
          >
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          <View style={styles.modalContent}>
            {/* Celebration Text */}
            <Animatable.Text
              animation="bounceIn"
              delay={300}
              style={styles.celebrationText}
            >
              🎉 Congratulations! 🎉
            </Animatable.Text>

            {/* Badge Display */}
            <Animatable.View
              animation="zoomIn"
              delay={500}
              style={styles.badgeContainer}
            >
              <Animated.View
                style={[
                  styles.badgeIcon,
                  {
                    transform: [{ rotate: rotateInterpolate }],
                    backgroundColor: badge.color,
                  },
                ]}
              >
                <Text style={styles.badgeIconText}>{badge.icon}</Text>
              </Animated.View>
            </Animatable.View>

            {/* Badge Name */}
            <Animatable.Text
              animation="fadeInUp"
              delay={700}
              style={styles.badgeName}
            >
              {badge.name}
            </Animatable.Text>

            {/* Badge Description */}
            <Animatable.Text
              animation="fadeInUp"
              delay={900}
              style={styles.badgeDescription}
            >
              {badge.description}
            </Animatable.Text>

            {/* XP Reward */}
            {badge.xpReward && badge.xpReward > 0 && (
              <Animatable.View
                animation="fadeInUp"
                delay={1100}
                style={styles.xpRewardContainer}
              >
                <Award size={20} color={PSBColors.primary.gold} />
                <Text style={styles.xpRewardText}>
                  +{badge.xpReward} XP Bonus!
                </Text>
              </Animatable.View>
            )}

            {/* Party Popper Effect */}
            <Animatable.View
              animation="bounceIn"
              delay={1300}
              style={styles.partyPopperContainer}
            >
              <Text style={styles.partyPopperText}>🎊</Text>
              <Text style={styles.partyPopperText}>🎊</Text>
              <Text style={styles.partyPopperText}>🎊</Text>
            </Animatable.View>

            {/* Continue Button */}
            <Animatable.View
              animation="fadeInUp"
              delay={1500}
              style={styles.buttonContainer}
            >
              <TouchableOpacity
                style={styles.continueButton}
                onPress={onClose}
              >
                <LinearGradient
                  colors={[PSBColors.primary.gold, '#E6B800']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: -20,
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 15,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 30,
    alignItems: 'center',
  },
  celebrationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PSBColors.primary.green,
    textAlign: 'center',
    marginBottom: 20,
  },
  badgeContainer: {
    marginBottom: 20,
  },
  badgeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  badgeIconText: {
    fontSize: 50,
  },
  badgeName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  badgeDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  xpRewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${PSBColors.primary.gold}20`,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  xpRewardText: {
    fontSize: 16,
    fontWeight: '600',
    color: PSBColors.primary.gold,
    marginLeft: 8,
  },
  partyPopperContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  partyPopperText: {
    fontSize: 30,
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: '100%',
  },
  continueButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BadgeUnlockModal;