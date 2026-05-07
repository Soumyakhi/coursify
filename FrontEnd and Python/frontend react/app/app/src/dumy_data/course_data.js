export const courses = [
  {
    id: 1,
    name: "Data Structures and Algorithms",
    description: "Complete DSA course with practice questions",
    rating: "0.0",
    videoFile: null,
    videoFilePath: "C:\\Users\\Soumya\\Downloads\\Major\\major\\uploads\\videos\\6c3e3b11-2720-41a0-9f82-9325dc9fb9d6.mp4",
    videoFilePathLq: "C:\\Users\\Soumya\\Downloads\\Major\\major\\uploads\\videos\\6c3e3b11-2720-41a0-9f82-9325dc9fb9d6.mp4_360p.mp4",
    questions: [
      {
        id: 1,
        question: "What is the time complexity of binary search?",
        option1: "O(n)",
        option2: "O(log n)",
        option3: "",
        option4: "",
        correctAnswer: 2
      },
      {
        id: 2,
        question: "Which data structure uses FIFO order?",
        option1: "Stack",
        option2: "Queue",
        option3: "",
        option4: "",
        correctAnswer: 2
      }
    ]
  },
  {
    id: 2,
    name: "Mathematics - Class 10",
    description: "Complete CBSE Class 10 mathematics syllabus with practice sets.",
    rating: "4.5",
    videoFile: null,
    videoFilePath: "https://www.youtube.com/watch?v=Algebra1",
    videoFilePathLq: "https://www.youtube.com/watch?v=Algebra1",
    questions: [
      {
        id: 1,
        question: "What is the value of x if 2x + 3 = 7?",
        option1: "1",
        option2: "2",
        option3: "3",
        option4: "4",
        correctAnswer: 2
      },
      {
        id: 2,
        question: "The square root of 144 is?",
        option1: "10",
        option2: "11",
        option3: "12",
        option4: "13",
        correctAnswer: 3
      }
    ]
  },
  {
    id: 3,
    name: "Physics - Class 12",
    description: "Learn mechanics, optics and modern physics with examples.",
    rating: "4.2",
    videoFile: null,
    videoFilePath: "https://www.youtube.com/watch?v=Motion1",
    videoFilePathLq: "https://www.youtube.com/watch?v=Motion1",
    questions: [
      {
        id: 1,
        question: "Who formulated the laws of motion?",
        option1: "Einstein",
        option2: "Newton",
        option3: "Galileo",
        option4: "Tesla",
        correctAnswer: 2
      },
      {
        id: 2,
        question: "The speed of light in vacuum is approximately?",
        option1: "3 x 10^8 m/s",
        option2: "3 x 10^6 m/s",
        option3: "3 x 10^5 m/s",
        option4: "3 x 10^7 m/s",
        correctAnswer: 1
      }
    ]
  },
  {
    id: 4,
    name: "Chemistry - Class 11",
    description: "Organic, Inorganic and Physical chemistry explained clearly.",
    rating: "4.3",
    videoFile: null,
    videoFilePath: "https://www.youtube.com/watch?v=OrgChem1",
    videoFilePathLq: "https://www.youtube.com/watch?v=OrgChem1",
    questions: [
      {
        id: 1,
        question: "Water is a polar molecule.",
        option1: "True",
        option2: "False",
        option3: "",
        option4: "",
        correctAnswer: 1
      },
      {
        id: 2,
        question: "The chemical formula of glucose is?",
        option1: "C6H12O6",
        option2: "C5H10O5",
        option3: "C6H6",
        option4: "CH4",
        correctAnswer: 1
      }
    ]
  },
  {
    id: 5,
    name: "Aptitude & Reasoning",
    description: "Prepare for placement tests and competitive exams.",
    rating: "4.1",
    videoFile: null,
    videoFilePath: "https://www.youtube.com/watch?v=Ratio1",
    videoFilePathLq: "https://www.youtube.com/watch?v=Ratio1",
    questions: [
      {
        id: 1,
        question: "If the ratio of boys to girls is 3:2 in a class of 25 students, how many boys are there?",
        option1: "10",
        option2: "15",
        option3: "12",
        option4: "18",
        correctAnswer: 2
      },
      {
        id: 2,
        question: "What comes next in the series: 2, 4, 8, 16, ?",
        option1: "20",
        option2: "24",
        option3: "32",
        option4: "36",
        correctAnswer: 3
      }
    ]
  }
];


export const search_courses = async (query) => {
  console.log("Mock API called with:", query);

  await new Promise((res) => setTimeout(res, 500));

  // 🔧 base templates
  const courseNames = [
    "React for Beginners",
    "Advanced React",
    "Spring Boot Mastery",
    "Java Basics",
    "Java Advanced Concepts",
    "Node.js Complete Guide",
    "Full Stack Web Development",
    "Python for Beginners",
    "Data Structures in Java",
    "Machine Learning Basics",
    "Deep Learning with Python",
    "Docker & Kubernetes",
    "System Design Fundamentals",
    "SQL & Database Design",
    "React Native Mobile Apps",
    "Angular Complete Guide",
    "C++ for Beginners",
    "Operating Systems",
    "Computer Networks",
    "MongoDB & NoSQL",
    "GraphQL with React",
    "TypeScript Mastery",
  ];

  // 🔧 helper to generate questions
  const generateQuestions = (index) => [
    { id: `q${index}-1`, question: "What is the core concept?" },
    { id: `q${index}-2`, question: "Explain main features?" },
    { id: `q${index}-3`, question: "Where is it used?" },
    { id: `q${index}-4`, question: "Advantages?" },
  ];

  // 🔧 generate courses
  const courses = courseNames.map((name, index) => ({
    id: String(index + 1),
    name,
    description: `${name} - complete course`,
    level: (index % 3) + 1, // 1,2,3
    rating: (4 + Math.random()).toFixed(1), // random 4.0 - 5.0
    videoFilePath: index % 2 === 0 ? `video${index + 1}.mp4` : "",
    totalEnrolled: Math.floor(Math.random() * 1500) + 100,
    timeStamps: ["00:00", "05:00", "10:00"],
    questions: generateQuestions(index + 1),
  }));

  // 🔍 filter
  const filtered = courses.filter((course) =>
    `${course.name} ${course.description}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return {
    courseDto: filtered,
    pageCount: Math.ceil(filtered.length / 6) || 1, // simulate pages
  };
};

export const get_recommended_courses = async (query = "") => {
  console.log("Mock API called:", query);

  // simulate network delay
  await new Promise((res) => setTimeout(res, 400));

  const courses = [
    { id: 1, name: "Data Structures Basics", level: 1, rating: 4.5 },
    { id: 2, name: "Database Management System", level: 2, rating: 4.2 },
    { id: 3, name: "React for Beginners", level: 1, rating: 4.8 },
    { id: 4, name: "Advanced React Patterns", level: 3, rating: 4.7 },
    { id: 5, name: "Spring Boot Mastery", level: 2, rating: 4.6 },
    { id: 6, name: "Java Programming Essentials", level: 1, rating: 4.3 },
    { id: 7, name: "Java Advanced Concepts", level: 3, rating: 4.6 },
    { id: 8, name: "Node.js Backend Development", level: 2, rating: 4.4 },
    { id: 9, name: "Full Stack Web Development", level: 3, rating: 4.9 },
    { id: 10, name: "Python for Beginners", level: 1, rating: 4.5 },
    { id: 11, name: "Machine Learning Basics", level: 2, rating: 4.3 },
    { id: 12, name: "Deep Learning with Python", level: 3, rating: 4.7 },
    { id: 13, name: "Docker & Kubernetes Basics", level: 2, rating: 4.4 },
    { id: 14, name: "System Design Fundamentals", level: 3, rating: 4.8 },
    { id: 15, name: "SQL Mastery Course", level: 1, rating: 4.2 },
    { id: 16, name: "MongoDB Complete Guide", level: 2, rating: 4.3 },
    { id: 17, name: "TypeScript in Depth", level: 2, rating: 4.6 },
    { id: 18, name: "C++ Programming Basics", level: 1, rating: 4.1 },
    { id: 19, name: "Operating Systems Concepts", level: 2, rating: 4.4 },
    { id: 20, name: "Computer Networks Explained", level: 2, rating: 4.5 },
    { id: 21, name: "GraphQL with React", level: 3, rating: 4.7 },
    { id: 22, name: "AWS Cloud Fundamentals", level: 2, rating: 4.6 },
  ];

  // 🔍 optional search filter (like backend)
  const filtered = query
    ? courses.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    : courses;

  // 🔥 sort by rating (recommended logic)
  const sorted = filtered.sort((a, b) => b.rating - a.rating);

  return sorted;
};