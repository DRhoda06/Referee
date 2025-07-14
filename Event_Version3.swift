import Foundation

enum EventType: String, Codable, CaseIterable {
    case goal, yellowCard, redCard, substitution
}

struct Event: Identifiable, Codable {
    let id: UUID
    let type: EventType
    let team: String
    let player: String?
    let timestamp: TimeInterval
    let notes: String?
}