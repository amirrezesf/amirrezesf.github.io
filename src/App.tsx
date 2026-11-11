import CustomCursor from "./components/CustomCursor";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import TerminalSection from "./components/TerminalSection";
import ProjectPlannerSection from "./components/ProjectPlannerSection";
import ContactSection from "./components/ContactSection";
import {AppProvider} from "./context/AppContext";
import './i18n';

function AppContent() {
    return (
        <div
            className="min-h-screen bg-bg-space font-sans selection:bg-accent-teal/30 selection:text-text-main relative">
            {/* Custom Cursor Dot & Outline for Desktop */}
            <CustomCursor/>

            {/* Navigation Header */}
            <Header/>

            {/* Structured Single-Screen View Sections */}
            <HeroSection/>

            <AboutSection/>

            <ProjectsSection/>

            <TerminalSection/>

            <ProjectPlannerSection/>

            <ContactSection/>
        </div>
    );
}

export default function App() {
    return (
        <AppProvider>
            <AppContent/>
        </AppProvider>
    );
}
