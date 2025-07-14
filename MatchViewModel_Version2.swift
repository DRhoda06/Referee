import Foundation
import Combine

class MatchViewModel: ObservableObject {
    @Published var matches: [Match] = []
    private var timers: [UUID: Date] = [:]
    
    func startNewMatch() {
        let match = Match(id: UUID(), homeTeam: "Team A", awayTeam: "Team B", events: [], startTime: Date(), half: 1, isActive: true)
        matches.append(match)
    }
    
    func startTimer(for match: Match) {
        timers[match.id] = Date()
    }
    
    func pauseTimer(for match: Match) {
        timers.removeValue(forKey: match.id)
    }
    
    func elapsedTime(for match: Match) -> TimeInterval {
        guard let start = timers[match.id] else { return 0 }
        return Date().timeIntervalSince(start)
    }
    
    func addEvent(to match: Match, type: EventType) {
        guard let idx = matches.firstIndex(where: { $0.id == match.id }) else { return }
        let event = Event(id: UUID(), type: type, team: "Home", player: nil, timestamp: elapsedTime(for: match), notes: nil)
        matches[idx].events.append(event)
    }
    
    func generateReport(for match: Match) {
        // Placeholder for PDF generation, could use PDFKit
        print("Match Report for \(match.homeTeam) vs \(match.awayTeam):")
        for event in match.events {
            print("\(event.type.rawValue.capitalized) @ \(Int(event.timestamp))s")
        }
    }
}