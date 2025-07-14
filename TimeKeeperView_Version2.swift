import SwiftUI

struct TimeKeeperView: View {
    @ObservedObject var watchVM: WatchMatchViewModel
    
    var body: some View {
        VStack {
            Text("Half: \(watchVM.half)")
            Text("Elapsed: \(Int(watchVM.elapsedTime))s")
            Button(watchVM.timerActive ? "Pause" : "Start") {
                watchVM.toggleTimer()
            }
            Divider()
            EventButtonsViewWatch(watchVM: watchVM)
        }
    }
}