import InvitationPage from "../components/InvitationPage";

export default function UtsavInvitation() {
  return <InvitationPage side="Utsav" intro="The Shah family warmly invites you to join us for the joyful ceremonies and sacred wedding of Utsav and Devanshi." events={[
    { time: "14 FEBRUARY · 11:00 AM ONWARDS", title: "Haldi", subtitle: "Patterns of joy, traditions of love", venue: "Dream Festiva", address: "Surat, Gujarat", mapUrl: "https://maps.app.goo.gl/Db93avrfJcpedhSg6" },
    { time: "14 FEBRUARY · 5:00 PM", title: "Grah Shanti", subtitle: "Prayers for an auspicious beginning", venue: "Dream Festiva", address: "Surat, Gujarat", mapUrl: "https://maps.app.goo.gl/Db93avrfJcpedhSg6" },
    { time: "15 FEBRUARY · 1:00 PM", title: "Varghodo", subtitle: "The wedding procession", venue: "Procession begins", address: "Surat, Gujarat", mapUrl: "https://maps.app.goo.gl/ZnZ7if9p9Gw2s5ac9" },
    { time: "15 FEBRUARY · 5:00 PM", title: "Lagan", subtitle: "A Timeless Union", venue: "Shri Surat Jilla Leuva Patidar Samaj", address: "Bardoli, Gujarat", mapUrl: "https://maps.app.goo.gl/kEdqWei3hXGYft9w8" },
  ]} />;
}
