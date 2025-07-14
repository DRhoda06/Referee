import Foundation
import WatchConnectivity

class WatchSyncService: NSObject, WCSessionDelegate {
    static let shared = WatchSyncService()
    var session: WCSession? = WCSession.isSupported() ? WCSession.default : nil
    
    func setup() {
        session?.delegate = self
        session?.activate()
    }
    
    func sendEvent(_ event: Event) {
        // Send event to iPhone
        let data = try? JSONEncoder().encode(event)
        session?.sendMessage(["event": data ?? Data()], replyHandler: nil)
    }
    
    // Implement WCSessionDelegate methods as needed
}