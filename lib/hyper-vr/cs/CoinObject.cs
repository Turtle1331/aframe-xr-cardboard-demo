using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CoinObject : MonoBehaviour {

	private bool active;
	private bool tree;
	private CoinObject parent;
	private int children;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
	
	public void activate() {
		//Debug.Log("Activate");
		active = true;
		transform.GetComponent<Renderer>().material.SetColor("_Color", Color.green);
	}
	
	public void setTree(CoinObject p, int c) {
		tree = true;
		parent = p;
		children = c;
		//Debug.Log("parent: " + parent);
	}
	
	public void alert() {
		//Debug.Log("Alert");
		if (tree) {
			children--;
			if (children <= 0) {
				activate();
			}
		}
	}

	private void OnCollisionEnter(Collision other) {
		//Debug.Log("collision: " + other);
	}

	private void OnTriggerEnter(Collider other) {
		//Debug.Log("trigger: " + other);
		if (active) {
			if (tree && parent != null) {
				parent.alert();
			}
			Destroy(gameObject);
		}
	}
}
