export interface Solution {
  id: number;
  name: string;
  image: string;
  description: string;
  fullDescription: string;
  documentationUrl?: string | null; // Use null for optional URLs
  manualUrl?: string;
  category?: string;
  subcategory?: string;
}

export const solutions: Solution[] = [
  {
    id: 1,
    name: "ROS Base",
    image: "",
    fullDescription: "",
    description: "Project to build and push ROS Base images",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/ros2_base",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "ROS Base",
  },
  {
    id: 2,
    name: "Cluster Management",
    image: "",
    fullDescription: "",
    description: "Installation scripts for Kubernetes and Rancher",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/continuous-delivery/cluster_management/",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Cluster Management",
  },
  {
    id: 3,
    name: "IIoT Platform",
    image: "",
    fullDescription: "",
    description: "Data Collection and device management",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20IIoT%20Platform%20%28IP%29/IP_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/t3.3-real-time-communications/iiot-platform_ip_wings/",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Data Services",
  },
  {
    id: 4,
    name: "Data Platform",
    image: "",
    fullDescription: "",
    description: "Persistence for IIoT Data Platform",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20Data%20Platform%20%28DS%29/DS_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/t3.3-real-time-communications/data-platform/wingschariot",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Data Services",
  },
  {
    id: 5,
    name: "Real Time Wireless Sensor Network",
    image: "",
    fullDescription: "",
    description:
      "Supported real time communication hardware. SDN, QDSN, WSN sensor network control and management.",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20Real%20Time%20Communications%20Network%20%28RC%29/RC_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/t3.3-real-time-communications/real_time_wireless_sensor_network",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Data Services",
  },
  {
    id: 6,
    name: "Collaboration Ambient Data Model",
    image: "",
    fullDescription: "",
    description: "Data model providing additional context to sensor data",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20Ambient%20Sensing%20Infrastructure%20%28AS%29/AS_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ambient-reasoning/aiprism-reasoning-model",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Data Services",
  },
  {
    id: 7,
    name: "Universal Robots Driver",
    image: "",
    fullDescription: "",
    description: "Universal Robots Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/universal_robots",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 8,
    name: "Sawyer Robot Driver",
    image: "",
    fullDescription: "",
    description: "Sawyer Robot Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/sawyer_robot",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 9,
    name: "Dobot CR10 Driver",
    image: "",
    fullDescription: "",
    description: "Dobot CR10 Robot Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/dobot_cr_10",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 10,
    name: "Dobot CR5 Driver",
    image: "",
    fullDescription: "",
    description: "Dobot CR5 Robot Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/dobot_cr_5",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 11,
    name: "Ridgeback Driver",
    image: "",
    fullDescription: "",
    description: "Ridgeback Robot Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/ridgeback_robot",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 12,
    name: "Comau Driver",
    image: "",
    fullDescription: "",
    description: "Comau Robot Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/comau-racer-7-1.4",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 13,
    name: "Oculus Touch Driver",
    image: "",
    fullDescription: "",
    description: "Oculus Touch Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/oculus-touch-driver",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 14,
    name: "Thorslab Precision Table Driver",
    image: "",
    fullDescription: "",
    description: "Thorlabs Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/thorlabs_kmts50e_m",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 15,
    name: "Siemens PLC Driver",
    image: "",
    fullDescription: "",
    description: "Siemens PLC Driver",
    documentationUrl: null,
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 16,
    name: "MBJ HDF-07-RD-s Driver",
    image: "",
    fullDescription: "",
    description: "MBJ HDF-07-RD-s Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/MBJ_HDF-07-RD-s",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 17,
    name: "SPS electronic Safety Tester KT1885 Driver",
    image: "",
    fullDescription: "",
    description: "SPS electronic Safety Tester KT1885 Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/%20SPS_electronic_Safety_Tester_KT1885",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 18,
    name: "FTE-AXIA80-DUAL SI-200-8/SI-500-20 Driver",
    image: "",
    fullDescription: "",
    description: "FTE-AXIA80-DUAL SI-200-8/SI-500-20 Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/FTE-AXIA80-DUAL%20SI-200-8/SI-500-20 ",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 19,
    name: "Planistar 32-32-Xled-3-VA-46w Driver",
    image: "",
    fullDescription: "",
    description: "Planistar 32-32-Xled-3-VA-46w Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/Planistar_32-32-Xled-3-VA-46w",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 20,
    name: "Schmalz SCG-HSS 1xE100 AR 25 47 Driver",
    image: "",
    fullDescription: "",
    description: "Schmalz SCG-HSS 1xE100 AR 25 47 Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/Schmalz%20SCG-HSS%201xE100%20AR%2025%2047",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },
  {
    id: 21,
    name: "Comau Driver",
    image: "",
    fullDescription: "",
    description: "Comau Robot Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/comau_racer_5#",
    category: "Collaboration Multiagent ROS based Robotic Framework",
    subcategory: "Hardware Drivers",
  },

  {
    id: 22,
    name: "Logitech Streamcam Driver",
    image: "",
    fullDescription: "",
    description: "Logitech Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/t3.3-real-time-communications/logitech_driver",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 23,
    name: "a2A5320-23ucBAS Driver",
    image: "",
    fullDescription: "",
    description: "Basler ace Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/t3.3-real-time-communications/basler_driver",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 24,
    name: "Microphone 130F21 ICP ARRAY Driver",
    image: "",
    fullDescription: "",
    description: "130F21 ICP ARRAY Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/t3.3-real-time-communications/130f21_driver",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 25,
    name: "Wenglor camera Driver",
    image: "",
    fullDescription: "",
    description: "Wenglor camera Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/wenglor-bb6k005",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 26,
    name: "Seeed Studio microphone Driver",
    image: "",
    fullDescription: "",
    description: "Seeed Studio Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/t3.3-real-time-communications/microphone_driver",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 27,
    name: "Delta Optical Driver",
    image: "",
    fullDescription: "",
    description: "Delta optical Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/t3.3-real-time-communications/delta_optical_driver",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 28,
    name: "Humidity and temperature sensor",
    image: "",
    fullDescription: "",
    description: "Humidity and temperature sensor",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/micro-ros-esp32-sensors",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 29,
    name: "Intel RealSense Driver",
    image: "",
    fullDescription: "",
    description: "Intel RealSense Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/t3.2_ambient_digitalization/ambient_digitalization_modules/Intel_RealSense_Driver",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 30,
    name: "UAM-05LP",
    image: "",
    fullDescription: "",
    description: "UAM-05LP Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/t3.2_ambient_digitalization/ambient_digitalization_modules/UAM-05LP_Drivere",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 31,
    name: "SEN54-SDN Driver",
    image: "",
    fullDescription: "",
    description: "SEN54-SDN Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/SEN54-SDN",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 32,
    name: "Openmote-B Driver",
    image: "",
    fullDescription: "",
    description: "Openmote-B Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/Openmote-B",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 33,
    name: "HOKUYO UTM-30LX-EW driver",
    image: "",
    fullDescription: "",
    description: "HOKUYO UTM-30LX-EW Driver",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ros-framework/base_hardware/HOKUYO%20UTM-30LX-EW",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 34,
    name: "Audio data publisher",
    image: "",
    fullDescription: "Publishes audio streams to ZMQ socket (unix or TCP/IP)",
    description: "Publishes audio streams to ZMQ socket (unix or TCP/IP)",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ambient-digitalization/audio-zmq",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 35,
    name: "Real sense video publisher",
    image: "",
    fullDescription:
      "Publishes video streams from real sense camera using IP protocols",
    description:
      "Publishes video streams from real sense camera using IP protocols",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ambient-digitalization/ip-realsense-camera",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 36,
    name: "RealSense data publisher",
    image: "",
    fullDescription: "Publishes video streams to ZMQ socket (unix or TCP/IP)",
    description: "Publishes video streams to ZMQ socket (unix or TCP/IP)",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ambient-digitalization/realsense-zmq",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 37,
    name: "RealSense bridge for ROS",
    image: "",
    fullDescription: "Publishes video streams to ROS",
    description: "Publishes video streams to ROS",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ambient-digitalization/realsense-zmq-bridge-ros",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 38,
    name: "3D reconstruction",
    image: "",
    fullDescription:
      "Performs 3D reconstruction by fusing multi-view RGBD sensory data",
    description:
      "Performs 3D reconstruction by fusing multi-view RGBD sensory data",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ambient-digitalization/3D_reconstruction",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 39,
    name: "Camera Interface Module",
    image: "",
    fullDescription:
      "A software module to get a reliable retrieval of the video flow from the camera",
    description:
      "A software module to get a reliable retrieval of the video flow from the camera",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp6/integration-of-the-solutions-in-industrial-environments",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 40,
    name: "UWB driver",
    image: "",
    fullDescription: "Driver to integrate UWB sensor data in ROS 2",
    description: "Driver to integrate UWB sensor data in ROS 2",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ambient-digitalization/uwb_driver",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },

  {
    id: 41,
    name: "Hood detection and tracking",
    image: "",
    fullDescription: "Detects and tracks hoods",
    description: "Detects and tracks hoods",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ambient-digitalization/sil-hood-digitalization",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 42,
    name: "2D Defect Detection",
    image: "",
    fullDescription: "Detects defects of hood",
    description: "Detects defects of hood",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ambient-digitalization/sil-hood-defect_detection",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 43,
    name: "Chip object detection",
    image: "",
    fullDescription: "Detects the 2D position of microchips",
    description: "Detects the 2D position of microchips",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ambient-digitalization/vigo-digitalization",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 44,
    name: "6D pose estimation",
    image: "",
    fullDescription: "Detects 6D pose of arbitrary objects",
    description: "Detects 6D pose of arbitrary objects",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/6D_pose_estimation",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 45,
    name: "3D Object detection",
    image: "",
    fullDescription: "Detects PCB Boards and determines best grasping position",
    description: "Detects PCB Boards and determines best grasping position",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/PCB_detection",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 46,
    name: "Defect detection",
    image: "",
    fullDescription: "Detects defects in microchips",
    description: "Detects defects in microchips",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/object_and_defect_detection",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 47,
    name: "AI Control",
    image: "",
    fullDescription: "AI Control",
    description: "AI Control",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/ai_control",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 48,
    name: "2D scanning module",
    image: "",
    fullDescription: "2D scanning module",
    description: "2D scanning module",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/2D_scanning_module",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 49,
    name: "Force-based behaviors",
    image: "",
    fullDescription:
      "Module that provides force-based behaviors for compliant execution",
    description:
      "Module that provides force-based behaviors for compliant execution",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/force_based_behaviors",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 50,
    name: "Speech Recognition",
    image: "",
    fullDescription:
      "Detect voice and recognize speech into text from real-time audio",
    description:
      "Detect voice and recognize speech into text from real-time audio",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/speech-recognition",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 51,
    name: "NLP Intent and Slot",
    image: "",
    fullDescription: "Intent and slot recognition from text utterance.",
    description: "Intent and slot recognition from text utterance.",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/nlp-intent-and-slot",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 52,
    name: "Person Follower",
    image: "",
    fullDescription:
      "Detect person and track relative angle for robot following.",
    description: "Detect person and track relative angle for robot following.",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/person-follower",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 53,
    name: "Follow me AMR module - UWB",
    image: "",
    fullDescription: "Detects a person and tracks a person",
    description: "Detects a person and tracks a person",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/ai-based-perception-modules/uwb-follow-me",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 54,
    name: "Inference Component: AI Engine",
    image: "",
    fullDescription:
      "Computer Vision model to detect persons, forklift and dangerous areas (through geo-fencing). The model is hosted on-edge. After training from public data the model has been optimized to be executed on edge modules",
    description:
      "Computer Vision model to detect persons, forklift and dangerous areas (through geo-fencing). The model is hosted on-edge. After training from public data the model has been optimized to be executed on edge modules",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp5/collaborative-system-human-safety-management,%20wp6/integration-of-the-solutions-in-industrial-environments",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },
  {
    id: 55,
    name: "Few-shot Key Point Detection",
    image: "",
    fullDescription: "Few-shot key point detection AI training",
    description: "Few-shot key point detection AI training",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/object_and_defect_detection/aiprism_deploy",
    category: "Collaborative workplaces digitalization",
    subcategory: "Ambient Digitalization Modules",
  },

  {
    id: 56,
    name: "Simulation Environment",
    image: "",
    fullDescription: "",
    description: "Simulation Environment",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20Simulation%20Environment%20%28SE%29/SE_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp3/t3.4-collaborative-simulation-platform/simulation-environment_se_tau",
    category: "Collaborative workplaces digitalization",
    subcategory: "Simulation Environment",
  },

  {
    id: 57,
    name: "Human Detection and Pose Estimation",
    image: "",
    fullDescription: "",
    description: "Human Detection and Pose Estimation",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/posenet-pose-estimation-module",
    category: "Collaborative workplaces digitalization",
    subcategory: "Human Modeling",
  },
  {
    id: 58,
    name: "Human Status Estimation Module",
    image: "",
    fullDescription: "",
    description: "Human Status Estimation Module",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/human_status_estimation",
    category: "Collaborative workplaces digitalization",
    subcategory: "Human Modeling",
  },
  {
    id: 59,
    name: "Human Activity Recognition",
    image: "",
    fullDescription: "",
    description: "Human Activity Recognition",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/human_activity_recognition",
    category: "Collaborative workplaces digitalization",
    subcategory: "Human Modeling",
  },
  {
    id: 60,
    name: "Affective Worker Condition Monitoring",
    image: "",
    fullDescription: "",
    description: "Monitoring of psychophysiological states of human workers",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ai-based-perception-modules/health_monitoring",
    category: "Collaborative workplaces digitalization",
    subcategory: "Human Modeling",
  },
  {
    id: 61,
    name: "Deployable Constraint based reactive Controller",
    image: "",
    fullDescription: "",
    description: "Deployable constraint-based reactive controller",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20AI-based%20Agent%20Level%20Reasoning%20Enhancing%20Modules%20%28DR%29/DR_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/agent-reasoning/reactive_controller",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "AI-based Agent level reasoning enhancing modules",
  },

  {
    id: 62,
    name: "HRC assembly constraint-based tasks",
    image: "",
    fullDescription: "",
    description: "Task specifications involving HRC in assembly",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20Human%20-%20Machine%20Interaction%20%28HMI%29%20Modules%20%28HI%29/HI_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/HRC_assembly",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "Human Machine Interaction Modules",
  },
  {
    id: 63,
    name: "Speech Synthesis",
    image: "",
    fullDescription: "",
    description: "Convert text to speech for voice control feedback",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20Human%20-%20Machine%20Interaction%20%28HMI%29%20Modules%20%28HI%29/HI_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/speech-synthesis",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "Human Machine Interaction Modules",
  },
  {
    id: 64,
    name: "Voice Control",
    image: "",
    fullDescription: "",
    description: "Voice Control system - from real-time audio to JSON output",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20Human%20-%20Machine%20Interaction%20%28HMI%29%20Modules%20%28HI%29/HI_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/voice-control",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "Human Machine Interaction Modules",
  },
  {
    id: 65,
    name: "Audio-based linguistic module",
    image: "",
    fullDescription: "",
    description: "Conversational module for human-robot interaction",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20Human%20-%20Machine%20Interaction%20%28HMI%29%20Modules%20%28HI%29/HI_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/voice_control_TAU",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "Human Machine Interaction Modules",
  },
  {
    id: 66,
    name: "Robot UI",
    image: "",
    fullDescription: "",
    description: "Robots UI deployed at ETRI.",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20Human%20-%20Machine%20Interaction%20%28HMI%29%20Modules%20%28HI%29/HI_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/robot_ui",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "Human Machine Interaction Modules",
  },

  {
    id: 67,
    name: "Skills for complex tasks",
    image: "",
    fullDescription: "",
    description:
      "Skills for complex tasks that require force-based robot behaviors (e.g. insertion) or learning from demonstrations",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/complex_tasks",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "Programming by Demonstration",
  },
  {
    id: 68,
    name: "PbD Module",
    image: "",
    fullDescription: "",
    description: "PbD module",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/PbD_module",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "Programming by Demonstration",
  },
  {
    id: 69,
    name: "Programming by Demonstration toolkit",
    image: "",
    fullDescription: "",
    description:
      "Toolkit to analyze demonstrations data and generate a learned motion model",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20Programming%20by%20Demonstration%20Environment%20%28PD%29/PD_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/PbD_toolkit",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "Programming by Demonstration",
  },
  {
    id: 70,
    name: "Painting PbD",
    image: "",
    fullDescription: "",
    description: "Painting and sanding programming by demonstration",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/painting_PbD",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "Programming by Demonstration",
  },
  {
    id: 71,
    name: "Multimodal interface PbD",
    image: "",
    fullDescription: "",
    description:
      "Multimodal Interface Prototype for programming robotic tasks (PROF)",
    documentationUrl: null,
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/multimodal_interface_PbD",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "Programming by Demonstration",
  },
  {
    id: 72,
    name: "BetFSM",
    image: "",
    fullDescription: "",
    description:
      "A behavior tree and finite state machine framework in Python using cooperative multitasking where new state machines or behavior-tree nodes can be easily specified",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20AI-based%20Agent%20Level%20Reasoning%20Enhancing%20Modules%20%28DR%29/DR_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/agent-reasoning/betfsm_coordination",
    category: "Tacit Knowledge Capture from workers",
    subcategory: "Agent level reasoning",
  },

  {
    id: 73,
    name: "Unified Planning tool",
    image: "",
    fullDescription: "",
    description: "Unified planning tool",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20AI-based%20Ambient%20Level%20Reasoning%20Enhancing%20Modules%20%28CR%29/CR_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/unified_planning_tool",
    category: "Enhanced Manufacturing Operations",
    subcategory: "Ambient Level Reasoning",
  },
  {
    id: 74,
    name: "Follow me AMR path planning",
    image: "",
    fullDescription: "",
    description: "AMR path planning module using UWB data",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20AI-based%20Ambient%20Level%20Reasoning%20Enhancing%20Modules%20%28CR%29/CR_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/amr_path_planning",
    category: "Enhanced Manufacturing Operations",
    subcategory: "Ambient Level Reasoning",
  },
  {
    id: 75,
    name: "HRC painting re/scheduler",
    image: "",
    fullDescription: "",
    description: "HRC Scheduler and Rescheduler for furniture painting",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20AI-based%20Ambient%20Level%20Reasoning%20Enhancing%20Modules%20%28CR%29/CR_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/ambient-reasoning/aw-scheduler",
    category: "Enhanced Manufacturing Operations",
    subcategory: "Ambient Level Reasoning",
  },
  {
    id: 76,
    name: "Collaborative order forming",
    image: "",
    fullDescription: "",
    description: "Collaborative order forming (follow-me)",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20AI-based%20Ambient%20Level%20Reasoning%20Enhancing%20Modules%20%28CR%29/CR_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/order_forming",
    category: "Enhanced Manufacturing Operations",
    subcategory: "Ambient Level Reasoning",
  },
  {
    id: 77,
    name: "Smart pick and place for recycling",
    image: "",
    fullDescription: "",
    description: "Smart pick and place for recycling",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20AI-based%20Ambient%20Level%20Reasoning%20Enhancing%20Modules%20%28CR%29/CR_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/recycling_pick_place",
    category: "Enhanced Manufacturing Operations",
    subcategory: "Ambient Level Reasoning",
  },
  {
    id: 78,
    name: "Smart depalletizing",
    image: "",
    fullDescription: "",
    description: "Smart depalletising",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20AI-based%20Ambient%20Level%20Reasoning%20Enhancing%20Modules%20%28CR%29/CR_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/smart_depalletizing",
    category: "Enhanced Manufacturing Operations",
    subcategory: "Ambient Level Reasoning",
  },
  {
    id: 79,
    name: "AI Assistant",
    image: "",
    fullDescription: "",
    description: "AI-assistant for easy operation",
    documentationUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/Components/AI-PRISM%20AI-based%20Ambient%20Level%20Reasoning%20Enhancing%20Modules%20%28CR%29/CR_component/",
    manualUrl:
      "https://documentation.aiprism-srv.cigip.upv.es/guides/Components/wp4/human-robot-interaction/ai-assistant",
    category: "Enhanced Manufacturing Operations",
    subcategory: "Ambient Level Reasoning",
  },
];

export const subcategoryDescriptions = {
  "Collaboration Multiagent ROS based Robotic Framework": {
    "ROS Base":
      "The ROS Framework acts as a nexus between all the different devices and modules required to command a robot. Ranging from the controller that gathers data, to the controller that conducts the robot, including any module involved in the tasks in between, them being, data treatment, path planning, AI algorithms, etc.",
    "Cluster Management":
      "The ROS Framework acts as a nexus between all the different devices and modules required to command a robot. Ranging from the controller that gathers data, to the controller that conducts the robot, including any module involved in the tasks in between, them being, data treatment, path planning, AI algorithms, etc.",
    "Data Services":
      "The Data Platform Component is designed to handle the persistence of data from the IIoT Platform component. This includes data from simulated entities, mapped IoT and Robot devices. The Platform is responsible for making the persisted data available in a batch or streaming manner.",
    "Hardware Drivers":
      "This module will comprise all the packages necessary to control any piece of equipment able to sense or actuate within the workspace, them being sensors, robots, PLC's, actuators, etc.",
  },

  "Collaborative workplaces digitalization": {
    "Ambient Digitalization Modules":
      "The Ambient Digitalization (AD) component creates a digital reconstruction of the working environment and the entities within it (such as human workers, robotic agents, and tools) by utilizing the data collected by the Ambient Sensing (AS) infrastructure. The goal of AD is to generate a virtual model that accurately replicates both the static and dynamic components of the real-world scenario, including their features and interactions.",
    "AI-based Perception Enhancing Modules":
      "The Perception Enhancement (PE) component consists of a suite of AI-based methods capable of processing the workplace digital reconstruction performed by Ambient Digitalization (AD) to accomplish several tasks of interest. Examples of such tasks include: (1) Object Detection and/or Segmentation, (2) Object 6D Pose Estimation, (3) Human action recognition, (4) Human health-status monitoring, and (5) Human postural analysis.",
    "Human Modeling": "",
    "Simulation Environment":
      "The Simulation Environment is a tool that allows photorealistic 3D representations of a collaborative manufacturing environment, including robots, industrial equipment and human agents. Its development is motivated by the idea of helping industrial partners to simulate processes in a more realistic way, enhancing the state of the art of current Digital Twins and considering human operators in the simulation. With the Simulation Environment, users will be able to recreate production plants and lines, taking into consideration interactions between the existing agents in the environment and integrating human avatars.",
  },
  "Tacit Knowledge Capture from workers": {
    "AI-based Agent level reasoning enhancing modules":
      "Every robot in an application is expected to act as an autonomous software agent, that must make sure that the robot executes the tasks that have been assigned to him by the operator, but also that the robot at the same time interacts appropriately with its environment. The latter consists not only of objects and/or other computer controlled devices, but also of the robot operator, and even people that are not involved in the agent's behaviour. The decisions that the robot agent makes autonomously are all about what action the robot should take next, given the current situation. And that situation in itself is the interaction between (at least) the following types of activities: task execution, world model updating, control of the robot's motions, and perception via the robot's sensors.",
    "Human Machine Interaction Modules":
      "An HMI module is part of the eTaSL controller explained in the programming-by-demonstration module. It consists basically of two parts: (1) Hardware abstraction Orocos components (HMI Modules) that know how to communicate with the hardware at hand (e.g. an HTC-Vive system or a force sensor) (2) A constraint-based description of how these signals relate to the task at hand (described in the eTaSL specification language). These will be added to the rest of the constraint-based description and executed by the eTaSl constraint-based controller",
    "Programming by Demonstration":
      "A constraint-based robot task specification will consist of two parts: (1) a probabilistic description of the demonstrated force/motion interactions describing nominal force/motion and the allowable variations on this nominal force/motion. (2) a model-based task constraint-based task description describing the parts of the task that is known before-hand. The constraints are described in a LUA-based language called eTaSL.",
    "Agent level reasoning":
      "Every robot in an application is expected to act as an autonomous software agent, that must make sure that the robot executes the tasks that have been assigned to him by the operator, but also that the robot at the same time interacts appropriately with its environment. The latter consists not only of objects and/or other computer controlled devices, but also of the robot operator, and even people that are not involved in the agent's behaviour. The decisions that the robot agent makes autonomously are all about what action the robot should take next, given the current situation. And that situation in itself is the interaction between (at least) the following types of activities: task execution, world model updating, control of the robot's motions, and perception via the robot's sensors.",
  },

  "Enhanced Manufacturing Operations": {
    "Ambient Level Reasoning":
      "The AI-based Ambient Level Reasoning Enhancing Modules (CR) are a set of modules that enable the ambient level reasoning, which is the reasoning that involves the coordination of activities performed by agents operating in the ambient environment.The vision is to develop standalone cloud applications (ie modules) specifically designed to solve different reasoning problems. Some examples of the problems in the scope of AI-based ambient level reasoning include: task allocation, task scheduling, task assignment, and optimal routing.",
  },
};
