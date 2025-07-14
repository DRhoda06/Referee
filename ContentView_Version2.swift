import SwiftUI

struct ContentView: View {
    @StateObject var matchVM = MatchViewModel()
    
    var body: some View {
        NavigationView {
            List {
                ForEach(matchVM.matches) { match in
                    NavigationLink(destination: MatchDetailView(match: match, matchVM: matchVM)) {
                        Text("\(match.homeTeam) vs \(match.awayTeam)")
                    }
                }
            }
            .navigationTitle("Matches")
            .toolbar {
                Button(action: { matchVM.startNewMatch() }) {
                    Image(systemName: "plus")
                }
            }
        }
    }
}