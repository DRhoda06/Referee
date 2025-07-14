import PDFKit
import UIKit

class PDFGenerator {
    static func generateReport(
        for match: Match,
        homePlayers: [String],
        awayPlayers: [String],
        refereeNotes: String
    ) -> Data? {
        let pdfMetaData = [
            kCGPDFContextCreator: "SoccerRefereeApp",
            kCGPDFContextAuthor: "Referee",
            kCGPDFContextTitle: "\(match.homeTeam) vs \(match.awayTeam) Match Report"
        ]
        let format = UIGraphicsPDFRendererFormat()
        format.documentInfo = pdfMetaData as [String: Any]

        let pageWidth = 595.2
        let pageHeight = 841.8
        let renderer = UIGraphicsPDFRenderer(bounds: CGRect(x: 0, y: 0, width: pageWidth, height: pageHeight), format: format)

        let margin: CGFloat = 30
        let contentWidth = pageWidth - 2 * margin

        let data = renderer.pdfData { ctx in
            ctx.beginPage()
            var y: CGFloat = margin

            func drawText(_ text: String, font: UIFont, color: UIColor = .black, x: CGFloat = margin, y: CGFloat) -> CGFloat {
                let attributes: [NSAttributedString.Key: Any] = [
                    .font: font,
                    .foregroundColor: color
                ]
                text.draw(at: CGPoint(x: x, y: y), withAttributes: attributes)
                return y + font.lineHeight + 2
            }

            // Header
            y = drawText("\(match.homeTeam) vs \(match.awayTeam)", font: .boldSystemFont(ofSize: 24), y: y)
            let dateString = DateFormatter.localizedString(from: match.startTime, dateStyle: .medium, timeStyle: .short)
            y = drawText("Date: \(dateString)", font: .systemFont(ofSize: 16), y: y)
            y = drawText("Venue: (Add venue here)", font: .systemFont(ofSize: 16), y: y)

            // Score Summary
            let homeGoals = match.events.filter { $0.type == .goal && $0.team == match.homeTeam }.count
            let awayGoals = match.events.filter { $0.type == .goal && $0.team == match.awayTeam }.count
            y = drawText("Final Score: \(match.homeTeam) \(homeGoals) - \(awayGoals) \(match.awayTeam)", font: .boldSystemFont(ofSize: 18), y: y)
            y += 10

            // Draw teams with incidents in tables
            func drawTeamTable(team: String, players: [String], startY: CGFloat) -> CGFloat {
                var y = startY
                // Table Header
                let rowHeight: CGFloat = 22
                let colPlayerWidth: CGFloat = contentWidth * 0.45
                let colIncidentWidth: CGFloat = contentWidth * 0.45

                ctx.cgContext.setFillColor(UIColor.systemGray6.cgColor)
                ctx.cgContext.fill(CGRect(x: margin, y: y, width: contentWidth, height: rowHeight))
                y = drawText("\(team) Lineup", font: .boldSystemFont(ofSize: 16), x: margin, y: y)
                y += 2

                // Table Column Headers
                let attrs: [NSAttributedString.Key: Any] = [.font: UIFont.boldSystemFont(ofSize: 15)]
                "Player".draw(at: CGPoint(x: margin + 6, y: y), withAttributes: attrs)
                "Incidents".draw(at: CGPoint(x: margin + colPlayerWidth + 6, y: y), withAttributes: attrs)
                y += rowHeight

                ctx.cgContext.setStrokeColor(UIColor.gray.cgColor)
                ctx.cgContext.setLineWidth(1)
                ctx.cgContext.move(to: CGPoint(x: margin, y: y))
                ctx.cgContext.addLine(to: CGPoint(x: margin + contentWidth, y: y))
                ctx.cgContext.strokePath()

                // Table Rows
                for player in players {
                    ctx.cgContext.setFillColor(UIColor.white.cgColor)
                    ctx.cgContext.fill(CGRect(x: margin, y: y, width: contentWidth, height: rowHeight))

                    let playerEvents = match.events.filter { $0.player == player && $0.team == team }
                    player.draw(at: CGPoint(x: margin + 6, y: y), withAttributes: [.font: UIFont.systemFont(ofSize: 15)])
                    var incidentX = margin + colPlayerWidth + 6
                    for event in playerEvents {
                        let timeStr = String(format: "%.0f", event.timestamp)
                        let display = "\(event.type.displayName) @ \(timeStr)s"
                        let color = event.type.color
                        let attributes: [NSAttributedString.Key: Any] = [
                            .font: UIFont.systemFont(ofSize: 14),
                            .foregroundColor: color
                        ]
                        display.draw(at: CGPoint(x: incidentX, y: y), withAttributes: attributes)
                        incidentX += (colIncidentWidth / max(1, playerEvents.count))
                    }
                    y += rowHeight
                }
                y += 10
                return y
            }

            y = drawTeamTable(team: match.homeTeam, players: homePlayers, startY: y)
            y = drawTeamTable(team: match.awayTeam, players: awayPlayers, startY: y)
            y += 10

            // Event Timeline with Colour Coding, as a list
            y = drawText("Event Timeline:", font: .boldSystemFont(ofSize: 16), y: y)
            y += 2
            for event in match.events.sorted(by: { $0.timestamp < $1.timestamp }) {
                let timeStr = String(format: "%.0f", event.timestamp)
                var eventLine = "\(timeStr)s: \(event.type.displayName) - \(event.team)"
                if let player = event.player {
                    eventLine += " (\(player))"
                }

                let color = event.type.color
                y = drawText(eventLine, font: .systemFont(ofSize: 14), color: color, y: y)
                if y > pageHeight - 120 {
                    ctx.beginPage()
                    y = margin
                }
            }
            y += 10

            // Referee Notes Section
            y = drawText("Referee Notes:", font: .boldSystemFont(ofSize: 16), y: y)
            let notesFont = UIFont.italicSystemFont(ofSize: 15)
            let notesColor = UIColor.darkGray
            let notesParagraphStyle = NSMutableParagraphStyle()
            notesParagraphStyle.lineBreakMode = .byWordWrapping
            let notesAttributes: [NSAttributedString.Key: Any] = [
                .font: notesFont,
                .foregroundColor: notesColor,
                .paragraphStyle: notesParagraphStyle
            ]
            let notesRect = CGRect(x: margin + 6, y: y, width: contentWidth - 12, height: 100)
            refereeNotes.draw(with: notesRect, options: .usesLineFragmentOrigin, attributes: notesAttributes, context: nil)
        }
        return data
    }
}

// Extend EventType to provide display name and color
extension EventType {
    var displayName: String {
        switch self {
        case .goal: return "Goal"
        case .yellowCard: return "Yellow Card"
        case .redCard: return "Red Card"
        case .substitution: return "Substitution"
        case .ownGoal: return "Own Goal"
        }
    }

    var color: UIColor {
        switch self {
        case .goal: return UIColor.systemGreen
        case .yellowCard: return UIColor.systemYellow
        case .redCard: return UIColor.systemRed
        case .substitution: return UIColor.systemBlue
        case .ownGoal: return UIColor.systemPink
        }
    }
}