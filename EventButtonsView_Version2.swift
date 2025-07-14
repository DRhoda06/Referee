import SwiftUI

struct EventButtonsView: View {
    var match: Match
    @ObservedObject var matchVM: MatchViewModel
    
    var body: some View {
        HStack {
            Button("Goal") { matchVM.addEvent(to: match, type: .goal) }
            Button("Yellow Card") { matchVM.addEvent(to: match, type: .yellowCard) }
            Button("Red Card") { matchVM.addEvent(to: match, type: .redCard) }
            Button("Substitution") { matchVM.addEvent(to: match, type: .substitution) }
        }
    }
}