import SwiftUI

struct EventButtonsViewWatch: View {
    @ObservedObject var watchVM: WatchMatchViewModel
    
    var body: some View {
        VStack {
            Button("Goal") { watchVM.markEvent(.goal) }
            Button("Yellow Card") { watchVM.markEvent(.yellowCard) }
            Button("Red Card") { watchVM.markEvent(.redCard) }
            Button("Substitution") { watchVM.markEvent(.substitution) }
        }
    }
}