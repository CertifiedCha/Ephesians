export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  experience: number;
  skills: string[];
  photo: string;
  email: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
    instagram?: string;
  };
  available: boolean;
  favorite: boolean;
  spotlight: boolean;
  likes: number;
}

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Darius Charles Fajardo",
    role: "Full Stack Developer",
    department: "Engineering",
    experience: 2,
    skills: ["Coding", "Production", "CSS", "JavaScript"],
    photo: "https://scontent.fmnl36-1.fna.fbcdn.net/v/t39.30808-6/494284355_1303653580699804_1925043377826567478_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEvUWWbi1K3WByQuCPoNKLvM7mmDLIiV1YzuaYMsiJXViejoycSG90YT_HGuYioKkdIi5Lt_9rMd_WdOUxLmXS8&_nc_ohc=4XDDDSgAgiQQ7kNvwFVj8vE&_nc_oc=AdmMasPybWqWW17DZnH-bs1K03GE10mQopBGhn7Crag-o_sBc4SbS-gUoqOsl5_gp0k&_nc_zt=23&_nc_ht=scontent.fmnl36-1.fna&_nc_gid=ewMWpRBiHcCk2QFH_ubRFA&oh=00_AfXDOtQcQSi2fVaajjxgUcgqDkzo2HAR3KelN7Cm3-hkZA&oe=68AE6125",
    email: "dcbfajardo@pcu.edu.ph",
    bio: "Full stack developer with a passion for creating efficient and scalable web applications. Experienced in both frontend and backend technologies.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahchen",
      twitter: "https://twitter.com/sarahchen",
      github: "https://github.com/sarahchen"
    },
    available: true,
    favorite: false,
    spotlight: true,
    likes: 42
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "Product Manager",
    department: "Product",
    experience: 7,
    skills: ["Product Strategy", "User Research", "Analytics", "Agile"],
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    email: "marcus.johnson@company.com",
    bio: "Strategic product manager focused on user-centered design and data-driven decisions. Expert in bringing complex products to market.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/marcusjohnson",
      twitter: "https://twitter.com/marcusj",
      instagram: "https://instagram.com/marcusj"
    },
    available: true,
    favorite: false,
    spotlight: true,
    likes: 38
  },
  {
    id: "3",
    name: "Arkhen Floyd Elomina",
    role: "Data Manager",
    department: "Data",
    experience: 4,
    skills: ["Layout", "Organize", "Production System"],
    photo: "https://scontent.fmnl36-1.fna.fbcdn.net/v/t39.30808-6/523662928_1449656172854989_1042573254877859322_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGcqVFw2bA_uVT6hTeB7wGym42xQBiz0LibjbFAGLPQuCT_DMEZAzYKnGpxnYxs_9VgYZxP4JUXXFyi5-CKYoeR&_nc_ohc=VA3nLegjF8sQ7kNvwGU1yIp&_nc_oc=AdnFMRoraqU1RYqCmwyIDipFXvq5lYtQGAQcUtiSYje3dh1lKzsFGo6lYiqyEpU2ZA4&_nc_zt=23&_nc_ht=scontent.fmnl36-1.fna&_nc_gid=AYF1NIOWXL5716qTVExplg&oh=00_AfXQIQsVvfyw6mA9uZiHUNSJyxXNLzK7jN0qPPkIIyBtgQ&oe=68AE6D5A",
    email: "afpelomina@pcu.edu.ph",
    bio: "Data manager with a knack for turning raw data into meaningful insights. Skilled in data visualization and statistical analysis.",
    socialLinks: {
      facebook: "https://www.facebook.com/arkhenfloyd.elomina.5",
      instagram: "https://www.instagram.com/floy.d4827/"
    },
    available: true,
    favorite: false,
    spotlight: false,
    likes: 51
  },
  {
    id: "4",
    name: "David Kim",
    role: "Camera Man",
    department: "Engineering",
    experience: 6,
    skills: ["Node.js", "Python", "PostgreSQL", "AWS"],
    photo: "https://scontent.fmnl36-1.fna.fbcdn.net/v/t39.30808-6/534637386_1448640679508571_3771887921517743322_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHU-l3rD-0Y9M6_r4PQu09xgezZyjVXO8yB7NnKNVc7zBsQZ7zAfZsAmvNZIaZDb8Wn6dM0iRE1NMGVXJTV7oWx&_nc_ohc=VaE2f1Gq5b8Q7kNvwFP1jfZ&_nc_oc=Adn8NniXiww2eqNQQGUGIql71OTFHwpTc9vCdQkCNNXX1BzJo4srh9V24PL4DAeCx0E&_nc_zt=23&_nc_ht=scontent.fmnl36-1.fna&_nc_gid=dWyPukSg4VbB6h4FD4L7cQ&oh=00_AfXlSYRv1Yly5RvdlrKhSSX2nphwCajj7y0ilKifjkkuTQ&oe=68AF0F76",
    email: "david.kim@company.com",
    bio: "Full-stack engineer specializing in scalable backend systems and cloud architecture. Enjoys optimizing performance and building robust APIs.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/davidkim",
      github: "https://github.com/davidkim"
    },
    available: true,
    favorite: false,
    spotlight: true,
    likes: 29
  },
  {
    id: "5",
    name: "Priya Sharma",
    role: "Data Scientist",
    department: "Analytics",
    experience: 3,
    skills: ["Python", "Machine Learning", "SQL", "Tableau"],
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    email: "priya.sharma@company.com",
    bio: "Data scientist with expertise in machine learning and statistical analysis. Passionate about turning data into actionable business insights.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/priyasharma",
      github: "https://github.com/priyasharma"
    },
    available: true,
    favorite: false,
    spotlight: false,
    likes: 67
  },
  {
    id: "6",
    name: "Alex Thompson",
    role: "Marketing Manager",
    department: "Marketing",
    experience: 5,
    skills: ["Digital Marketing", "Content Strategy", "SEO", "Analytics"],
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    email: "alex.thompson@company.com",
    bio: "Creative marketing professional focused on building brand awareness and driving growth through innovative digital strategies.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/alexthompson",
      twitter: "https://twitter.com/alexmarketing"
    },
    available: true,
    favorite: false,
    spotlight: false,
    likes: 33
  },
  {
    id: "7",
    name: "Jennifer Liu",
    role: "DevOps Engineer",
    department: "Engineering",
    experience: 4,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face",
    email: "jennifer.liu@company.com",
    bio: "DevOps engineer passionate about automation and building reliable infrastructure. Expert in containerization and cloud deployment.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/jenniferliu",
      github: "https://github.com/jenniferliu"
    },
    available: true,
    favorite: false,
    spotlight: false,
    likes: 45
  },
  {
    id: "8",
    name: "Robert Brown",
    role: "Sales Director",
    department: "Sales",
    experience: 8,
    skills: ["Sales Strategy", "Team Leadership", "CRM", "Negotiation"],
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
    email: "robert.brown@company.com",
    bio: "Experienced sales leader with a track record of building high-performing teams and exceeding revenue targets.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/robertbrown"
    },
    available: true,
    favorite: false,
    spotlight: false,
    likes: 28
  }
];

export const departments = Array.from(new Set(teamMembers.map(member => member.department))).sort();