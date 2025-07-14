import SwiftUI

struct MatchDetailView: View {
    var match: Match
    @ObservedObject var matchVM: MatchViewModel
    
    var body: some View {
        VStack(spacing: 20) {
            Text("\(match.homeTeam) vs \(match.awayTeam)").font(.title)
            Text("Half: \(match.half)")
            Text("Elapsed: \(Int(matchVM.elapsedTime(for: match))) sec").font(.headline)
            HStack {
                Button("Start Half") { matchVM.startTimer(for: match) }
                Button("Pause") { matchVM.pauseTimer(for: match) }
            }
            Divider()
            EventButtonsView(match: match, matchVM: matchVM)
            Divider()
            List(match.events) { event in
                Text("\(event.type.rawValue.capitalized) - \(event.team) \(event.player ?? "") @ \(Int(event.timestamp))s")
            }
            Button("Generate Report") {
                matchVM.generateReport(for: match)
            }
        }
        .padding()
    }
}