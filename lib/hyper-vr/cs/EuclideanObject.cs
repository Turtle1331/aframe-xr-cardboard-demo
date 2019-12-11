using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EuclideanObject : MonoBehaviour {
	
	public Vector3 position;
	
	private EuclideanPlane plane;
	
    void Start() {
		position = transform.localPosition;
        plane = transform.parent.GetComponent<EuclideanPlane>();
    }

    // Update is called once per frame
    void Update() {
        //transform.localPosition = plane.apply(position);
    }
}
