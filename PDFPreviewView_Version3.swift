import SwiftUI
import PDFKit
import UIKit

struct PDFPreviewView: View {
    let pdfData: Data
    @State private var showShareSheet = false

    var body: some View {
        VStack {
            PDFKitView(data: pdfData)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            Button(action: { showShareSheet = true }) {
                Label("Share PDF", systemImage: "square.and.arrow.up")
                    .font(.headline)
                    .padding()
            }
            .sheet(isPresented: $showShareSheet) {
                ActivityView(activityItems: [pdfData], applicationActivities: nil)
            }
        }
        .navigationTitle("Match Report")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// PDFKitView wraps PDFView for SwiftUI
struct PDFKitView: UIViewRepresentable {
    let data: Data

    func makeUIView(context: Context) -> PDFView {
        let pdfView = PDFView()
        pdfView.document = PDFDocument(data: data)
        pdfView.autoScales = true
        return pdfView
    }

    func updateUIView(_ pdfView: PDFView, context: Context) {
        pdfView.document = PDFDocument(data: data)
    }
}

// ActivityView for sharing files
struct ActivityView: UIViewControllerRepresentable {
    var activityItems: [Any]
    var applicationActivities: [UIActivity]? = nil

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: activityItems, applicationActivities: applicationActivities)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}