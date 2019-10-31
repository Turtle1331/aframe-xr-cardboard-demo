using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TriggerBoolean : MonoBehaviour {

	public bool triggered { get; private set; }

	private void OnTriggerEnter(Collider other) {
        //Debug.Log("TRIGGERED");
        triggered = true;
    }

    private void OnTriggerExit(Collider other) {
        //Debug.Log("not triggered");
        triggered = false;
    }
}
