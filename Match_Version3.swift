import Foundation

struct Match: Identifiable, Codable {
    let id: UUID
    var homeTeam: String
    var awayTeam: String
    var events: [Event]
    var startTime: Date
    var half: Int
    var isActive: Bool
}