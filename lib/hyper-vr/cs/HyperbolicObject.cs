using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HyperbolicObject : MonoBehaviour {
    
    public Vector3 position;

    private HyperbolicPlane plane;

    // Start is called before the first frame update
    void Start() {
        position = transform.position;
        plane = transform.parent.gameObject.GetComponent<HyperbolicPlane>();
    }

    // Update is called once per frame
    void Update() {
        transform.position = plane.apply(position, true);
        //Debug.Log(transform.position);
    }
}
