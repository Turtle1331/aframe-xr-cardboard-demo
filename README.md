# Aframe XR Cardboard Demo
This is an Aframe-based 6DoF VR application using mobile AR for world tracking functionality. It is a work in progress. Check out the demo on a mobile device using the instructions below. 

## iOS
1. Go to the App store and download [WebXR Viewer](https://apps.apple.com/us/app/webxr-viewer/id1295998056) by Mozilla.
2. Open the following URL: https://turtle1331.github.io/aframe-xr-cardboard-demo/boundary/index.html
3. You should see a popup titled "Allow usage of Device Motion?" Make sure Device Motion is enabled and click Confirm.
4. Wait for the "AR Session Started" message to disappear. Swipe down from the top to show the URL bar and click on the icon with three vertical sliders. You should see some yellow points appearing in the camera view.
5. If you slowly move the camera side to side while pointing it at the floor, you should see more yellow points appear, and eventually, an orange grid should appear. If it doesn't appear, try pointing the camera at a different surface. 
6. Point the phone at the orange grid and tap anywhere on the screen to place a purple cube at the center of the screen on the floor. (You may have already done so accidentally.  You can refresh the page to restart if you want.)
7. Point the phone at a point on the floor and tap to place a boundary corner. If you misplaced it and want to remove it, you can tap twice on it (remember: use the center of the screen, not your finger position). On the first tap, it should turn brighter, and on the second, it should disappear. 
8. Repeat step 7 a few times to create a polygonal boundary that represents the perimeter of where you can safely walk. 
9. Double tap on the cube.  The camera view of the real world should disappear, and the screen should show a purple textured floor plane and a light blue sky.  
10. Depending on your position, you may see the boundary as a series of walls with a cyan grid appearance. As you approach the boundary, it becomes visible. Try moving around to see it. 
11. That's all there is for now. If you have any questions or suggestions or would like to contribute, feel free to leave an issue or clone/fork the repository. 

# Android

I have not been able to find a working WebXR-based AR demo for Android. If you find one, please post an issue!
