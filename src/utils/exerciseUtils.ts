
import { Pose, PoseKeypoint, calculateAngle, getKeypoint } from '@/services/poseDetectionService';

// Calculate the distance between two keypoints
export function calculateDistance(p1: PoseKeypoint, p2: PoseKeypoint): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

// Check if a pose is symmetric (left and right sides are balanced)
export function checkSymmetry(pose: Pose): boolean {
  // Get keypoints
  const leftShoulder = getKeypoint(pose, 'left_shoulder');
  const rightShoulder = getKeypoint(pose, 'right_shoulder');
  const leftHip = getKeypoint(pose, 'left_hip');
  const rightHip = getKeypoint(pose, 'right_hip');
  const leftKnee = getKeypoint(pose, 'left_knee');
  const rightKnee = getKeypoint(pose, 'right_knee');
  
  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftKnee || !rightKnee) {
    return false;
  }
  
  // Calculate distances to check symmetry
  const leftShoulderToHip = calculateDistance(leftShoulder, leftHip);
  const rightShoulderToHip = calculateDistance(rightShoulder, rightHip);
  
  const leftHipToKnee = calculateDistance(leftHip, leftKnee);
  const rightHipToKnee = calculateDistance(rightHip, rightKnee);
  
  // Calculate symmetry ratio (1.0 means perfect symmetry)
  const shoulderHipSymmetry = Math.min(leftShoulderToHip, rightShoulderToHip) / 
                             Math.max(leftShoulderToHip, rightShoulderToHip);
  
  const hipKneeSymmetry = Math.min(leftHipToKnee, rightHipToKnee) / 
                         Math.max(leftHipToKnee, rightHipToKnee);
  
  // Return true if both symmetry ratios are above threshold (0.85 means 85% symmetrical)
  return shoulderHipSymmetry > 0.85 && hipKneeSymmetry > 0.85;
}

// Check if the back is straight during exercises
export function checkBackAlignment(pose: Pose): { isAligned: boolean; angle: number } {
  const shoulder = getKeypoint(pose, 'left_shoulder');
  const hip = getKeypoint(pose, 'left_hip');
  const knee = getKeypoint(pose, 'left_knee');
  
  if (!shoulder || !hip || !knee) {
    return { isAligned: false, angle: 0 };
  }
  
  const backAngle = calculateAngle(shoulder, hip, knee);
  const isAligned = backAngle > 160; // Back is considered straight if angle is > 160 degrees
  
  return { isAligned, angle: backAngle };
}

// Calculate the depth of a squat based on hip and knee positions
export function calculateSquatDepth(pose: Pose): { 
  depth: 'shallow' | 'good' | 'deep';
  angle: number; 
} {
  const hip = getKeypoint(pose, 'left_hip');
  const knee = getKeypoint(pose, 'left_knee');
  const ankle = getKeypoint(pose, 'left_ankle');
  
  if (!hip || !knee || !ankle) {
    return { depth: 'shallow', angle: 0 };
  }
  
  const kneeAngle = calculateAngle(hip, knee, ankle);
  
  if (kneeAngle > 120) {
    return { depth: 'shallow', angle: kneeAngle };
  } else if (kneeAngle > 90) {
    return { depth: 'good', angle: kneeAngle };
  } else {
    return { depth: 'deep', angle: kneeAngle };
  }
}

// Check if knees are aligned with toes during a squat
export function checkKneeAlignment(pose: Pose): { 
  isAligned: boolean; 
  message: string;
} {
  const knee = getKeypoint(pose, 'left_knee');
  const ankle = getKeypoint(pose, 'left_ankle');
  const hip = getKeypoint(pose, 'left_hip');
  
  if (!knee || !ankle || !hip) {
    return { isAligned: false, message: 'Cannot detect knee position' };
  }
  
  // Check if knees are going too far forward (over toes)
  const kneeForwardDistance = knee.x - ankle.x;
  
  if (kneeForwardDistance < -50) {
    return { 
      isAligned: false, 
      message: 'Knees are too far forward. Shift weight to heels.' 
    };
  }
  
  // Check if knees are caving inward
  const hipToAnkleMidpoint = (hip.x + ankle.x) / 2;
  const kneeInwardDistance = hipToAnkleMidpoint - knee.x;
  
  if (kneeInwardDistance > 30) {
    return { 
      isAligned: false, 
      message: 'Knees are caving inward. Push knees outward.' 
    };
  }
  
  return { isAligned: true, message: 'Good knee alignment' };
}

// Get a qualitative assessment of exercise form
export function getFormQuality(
  formIssues: string[]
): 'excellent' | 'good' | 'fair' | 'poor' {
  const issueCount = formIssues.length;
  
  if (issueCount === 0) {
    return 'excellent';
  } else if (issueCount === 1) {
    return 'good';
  } else if (issueCount === 2) {
    return 'fair';
  } else {
    return 'poor';
  }
}
