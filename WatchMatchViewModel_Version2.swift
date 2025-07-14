import Foundation

class WatchMatchViewModel: ObservableObject {
    @Published var half: Int = 1
    @Published var elapsedTime: TimeInterval = 0
    @Published var timerActive: Bool = false
    
    func toggleTimer() {
        timerActive.toggle()
        // Actual timer logic for watchOS omitted for brevity
    }
    
    func markEvent(_ type: EventType) {
        // Send event to iPhone via WatchConnectivity
    }
}