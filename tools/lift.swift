// Lift the subject out of a photo with macOS Vision (same engine as "Copy Subject" in Photos). Free, local.
//   lift in.jpg out.png [instance,instance...]   (no list = every subject; "list" prints the count)
import Foundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins

let args = CommandLine.arguments
guard args.count >= 3, let input = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else { print("usage: lift in.jpg out.png"); exit(1) }
let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: input)
do {
  try handler.perform([req])
  guard let obs = req.results?.first, !obs.allInstances.isEmpty else { print("no subject"); exit(2) }
  if args.count >= 4 && args[3] == "list" { print("instances", obs.allInstances.count); exit(0) }
  var pick = obs.allInstances
  if args.count >= 4 { pick = IndexSet(args[3].split(separator: ",").compactMap { Int($0) }) }
  let buf = try obs.generateMaskedImage(ofInstances: pick, from: handler, croppedToInstancesExtent: true)
  let out = CIImage(cvPixelBuffer: buf)
  let ctx = CIContext()
  try ctx.writePNGRepresentation(of: out, to: URL(fileURLWithPath: args[2]), format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
  print("ok", Int(out.extent.width), "x", Int(out.extent.height))
} catch { print("error", error); exit(3) }
