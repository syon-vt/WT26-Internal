import radhikaPhoto from './assets/profile/Radhika.JPG';
import adityaSPhoto from './assets/profile/Aditya Shukla.png';
import bhavyaPhoto from './assets/profile/Bhavya.png';
import reenuPhoto from './assets/profile/Reenu.JPG';
import adityaAPhoto from './assets/profile/Aditya Acharya.JPG';
import sarahPhoto from './assets/profile/Sarah.JPG';
import rujinPhoto from './assets/profile/Rujin.jpg';
import nitinPhoto from './assets/profile/Nitin.jpg';
import varshithPhoto from './assets/profile/Varshith.JPG';
import amanPhoto from './assets/profile/Aman.JPG';

export const MAIN_DATA = [
  {
    id: 1,
    name: "Radhika",
    photo: radhikaPhoto,
    blurb: "You'll smile warmly at someone's work and then give them a zero without blinking. Iconic, honestly.",
    ans: [5, 1, 5, 5, 3, 1, 1, 4, 1, 1, 1, 1, 1, 1, 5, 1, 3, 1, 1, 1]
  },
  {
    id: 2,
    name: "Aditya Shukla",
    photo: adityaSPhoto,
    blurb: "Holy baddie! Leg days are non-negotiable, “that's crazy” is your entire personality, and has that splash of zesty energy.",
    ans: [2, 5, 5, 5, 1, 3, 5, 5, 3, 1, 5, 5, 5, 5, 1, 3, 3, 1, 5, 1]
  },
  {
    id: 3,
    name: "Bhavya",
    photo: bhavyaPhoto,
    blurb: "Slow to warm up, impossible to shake once you do. You pick your people carefully and then let them change you. A total teddy bear on the inside. That's a rare thing.",
    ans: [4, 1, 4, 3, 5, 2, 1, 4, 1, 1, 2, 2, 4, 4, 5, 3, 4, 4, 4, 1]
  },
  {
    id: 4,
    name: "Reenu",
    photo: reenuPhoto,
    blurb: "Never in class, somehow acing everything, and lowkey convinced you were born in the wrong country. You're everybody's mum whether they asked for it or not.",
    ans: [4, 3, 4, 5, 1, 4, 3, 1, 1, 3, 1, 4, 5, 5, 5, 5, 3, 3, 2, 3]
  },
  {
    id: 5,
    name: "Aditya Acharya",
    photo: adityaAPhoto,
    blurb: "You're reserved and nonchalant until you get close to someone. After your vibes match, you both go crazy.",
    ans: [3, 4, 2, 4, 2, 2, 3, 4, 4, 2, 5, 3, 5, 5, 4, 3, 3, 2, 4, 2]
  },
  {
    id: 6,
    name: "Sarah",
    photo: sarahPhoto,
    blurb: "You get things done, no compromises. People see your reaction on your face before you even open your mouth.",
    ans: [4, 1, 5, 2, 3, 5, 3, 5, 1, 5, 2, 4, 4, 2, 5, 1, 3, 5, 3, 1]
  },
  {
    id: 7,
    name: "Rujin",
    photo: rujinPhoto,
    blurb: "Gotham got a billionaire in a cape. GDG got you. We won.",
    ans: [3, 2, 4, 5, 3, 4, 1, 1, 3, 1, 3, 5, 5, 5, 5, 1, 4, 1, 2, 3]
  },
  {
    id: 8,
    name: "Nitin",
    photo: nitinPhoto,
    blurb: "Seeing you is rarer than witnessing a blue moon, but you've secretly got us covered.",
    ans: [4, 1, 5, 5, 5, 5, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 3, 1, 1, 1]
  },
  {
    id: 9,
    name: "Varshith",
    photo: varshithPhoto,
    blurb: "Nothing happens around without you knowing cause you got that aura. You also love all the tea.",
    ans: [1, 1, 5, 1, 1, 1, 5, 1, 5, 5, 1, 5, 5, 5, 5, 5, 3, 5, 5, 1]
  },
  {
    id: 10,
    name: "Aman",
    photo: amanPhoto,
    blurb: "A perfectionist at heart. Anyone standing between you and getting it right has made a very poor life decision.",
    ans: [1, 4, 3, 5, 4, 3, 2, 2, 1, 5, 3, 5, 5, 4, 5, 5, 1, 1, 4, 4]
  }
];

export const QUESTIONS = [
  {
    text: "I would sell my ethics for a really good aesthetic",
    weight: 1,
    minLabel: "I have principles, thanks",
    maxLabel: "Beauty is my religion"
  },
  {
    text: "I would fight a three legged dog for 20 rs and an orange lays",
    weight: 1,
    minLabel: "I fight for animal rights",
    maxLabel: "Ain't anything stopping me from my lays"
  },
  {
    text: "I feel genuine guilt when I accidentally close a tab I didn't mean to",
    weight: 1,
    minLabel: "It's just a tab lol",
    maxLabel: "RIP lil bro, I'm so sorry"
  },
  {
    text: "If a stranger handed me an unmarked USB drive, I'd plug it in",
    weight: 1,
    minLabel: "I have a functioning brain",
    maxLabel: "Worth the risk, let's gooo"
  },
  {
    text: "I've watched my phone ring, made eye contact with the screen, and watched it die",
    weight: 1,
    minLabel: "I answer on the first ring",
    maxLabel: "Let it go to voicemail"
  },
  {
    text: "I don't pick up calls even if the world is ending",
    weight: 1,
    minLabel: "I love people",
    maxLabel: "I got better things to do"
  },
  {
    text: "I have rehearsed arguments for fights that have never happened and will never happen",
    weight: 1,
    minLabel: "I live in the present",
    maxLabel: "I have a full courtroom in my head"
  },
  {
    text: "I see someone horizontal on a couch doing nothing and think 'that's the dream'",
    weight: 1,
    minLabel: "I aspire to more",
    maxLabel: "Goals honestly"
  },
  {
    text: "Someone tells me this antique mirror has a dark history. I'd hang it in my room anyway",
    weight: 1,
    minLabel: "I've seen Conjuring",
    maxLabel: "Aesthetic first, haunting later"
  },
  {
    text: "I relate deeply to leftover food that nobody came back for",
    weight: 1,
    minLabel: "I have my people",
    maxLabel: "Been there, felt that"
  },
  {
    text: "I would negotiate with a demon if the deal came with good amenities",
    weight: 1,
    minLabel: "I have standards and a soul",
    maxLabel: "Depends on the WiFi speed"
  },
  {
    text: "If I became a ghost, I would be the most passive-aggressive one in the building",
    weight: 1,
    minLabel: "I'd be a peaceful spirit",
    maxLabel: "Moving their stuff 1cm daily"
  },
  {
    text: "In a horror movie, I am the character who makes it to the end",
    weight: 1,
    minLabel: "I'm background character #4",
    maxLabel: "I'm writing the sequel"
  },
  {
    text: "I could pull off something deeply chaotic and leave zero evidence",
    weight: 1,
    minLabel: "I'd confess immediately",
    maxLabel: "I am the alibi"
  },
  {
    text: "On a scale of 1-5, how glad is the universe that you showed up",
    weight: 1,
    minLabel: "It did not ask for me",
    maxLabel: "Honestly a gift to the cosmos"
  },
  {
    text: "I give off 'top of the class' energy while operating entirely on vibes and muscle memory",
    weight: 1,
    minLabel: "I actually do the work",
    maxLabel: "Vibe-based excellence only"
  },
  {
    text: "How much of you is just pure, unhinged, chaotic little creature energy",
    weight: 1,
    minLabel: "I am composed and normal",
    maxLabel: "I am the chaos"
  },
  {
    text: "My room has things in it that I have not acknowledged in over three months",
    weight: 1,
    minLabel: "My room is clean and good",
    maxLabel: "There are things living in there"
  },
  {
    text: "My emotional support is a single 'damn' and a slow nod",
    weight: 1,
    minLabel: "I am emotionally available",
    maxLabel: "Damn. Anyway—"
  },
  {
    text: "I have knocked something over today and I was just standing there",
    weight: 1,
    minLabel: "I have full control of my body",
    maxLabel: "Gravity has a personal vendetta"
  },
];

//last 5 questions have more weight