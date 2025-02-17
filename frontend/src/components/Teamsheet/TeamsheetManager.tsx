import React, { useState } from "react";
import { Teamsheet } from "../../types";
import TeamsheetList from "./TeamsheetList";
import TeamsheetPage from "./TeamsheetPage";

const TeamsheetManager: React.FC = () => {
    const [currentView, setCurrentView] = useState<'list' | 'page'>('list'); // Default to "list"
    const [editingTeamsheet, setEditingTeamsheet] = useState<Teamsheet | null>(null);

    const switchToPage = (teamsheet?: Teamsheet) => {
        setEditingTeamsheet(teamsheet || null); // Edit if teamsheet provided, else create new
        setCurrentView('page');
    };

    const switchToList = () => {
        setEditingTeamsheet(null);
        setCurrentView('list');
    };

    return (
        <div>
            {currentView === 'page' ? (
                <TeamsheetPage
                    switchToList={switchToList}
                    editingTeamsheet={editingTeamsheet}
                />
            ) : (
                <TeamsheetList switchToPage={switchToPage} />
            )}
        </div>
    );
};

export default TeamsheetManager;