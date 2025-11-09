// swift-tools-version: 5.9
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "CirurgiaoApp",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "CirurgiaoApp",
            targets: ["CirurgiaoApp"]
        )
    ],
    dependencies: [
        // Firebase
        .package(
            url: "https://github.com/firebase/firebase-ios-sdk.git",
            from: "10.20.0"
        )
    ],
    targets: [
        .target(
            name: "CirurgiaoApp",
            dependencies: [
                .product(name: "FirebaseAnalytics", package: "firebase-ios-sdk"),
                .product(name: "FirebaseCrashlytics", package: "firebase-ios-sdk"),
                .product(name: "FirebaseAuth", package: "firebase-ios-sdk")
            ],
            path: "CirurgiaoApp"
        ),
        .testTarget(
            name: "CirurgiaoAppTests",
            dependencies: ["CirurgiaoApp"],
            path: "CirurgiaoAppTests"
        )
    ]
)
