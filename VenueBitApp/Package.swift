// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "VenueBitApp",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "VenueBitApp",
            targets: ["VenueBitApp"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/optimizely/swift-sdk.git", from: "4.0.0")
    ],
    targets: [
        .target(
            name: "VenueBitApp",
            dependencies: [
                .product(name: "Optimizely", package: "swift-sdk")
            ],
            path: "VenueBitApp"
        )
    ]
)
