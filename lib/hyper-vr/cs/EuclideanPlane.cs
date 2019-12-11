using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Valve.VR;

public class EuclideanPlane : MonoBehaviour {

	public Transform player;
    public SteamVR_Input_Sources handType;
    public SteamVR_Action_Boolean reorientAction;
    public Transform cube;
	public Transform overlay;
	public AudioSource audio;

	private Transform camera;
	private Vector3 prev;
	private bool started;
    private bool reorienting;
    private Vector3 cubeOffset;
	private int oldChildCount;
	private float timer;
	private bool tree;
	private int goal;

	// Use this for initialization
	void Start () {
		camera = player.Find("SteamVRObjects").Find("VRCamera");
        started = false;
		transform.position = new Vector3(0, -1, 0);
		oldChildCount = 0;
		timer = -1;
	}
	
	// Update is called once per frame
	void Update () {
		if (!started) {
			Vector2 xy = new Vector2(camera.position.x, camera.position.z);
        	started = (xy.magnitude < 0.2);
			if (started) {
				transform.position = new Vector3();
				if (!tree) transform.GetChild(0).GetComponent<CoinObject>().activate();
			}
		}

		if (!reorienting && reorientAction.GetState(handType)) {
            if (new Vector2(camera.position.x, camera.position.z).magnitude > 0.25) {
                reorienting = true;
                //Debug.Log("Start reorient");
                
                Vector2 posOffset = new Vector2(-camera.position.x, -camera.position.z);
                posOffset.Normalize();
                float yrot = camera.rotation.eulerAngles.y * Mathf.Deg2Rad;
                Vector2 angleOffset = new Vector2(Mathf.Sin(yrot), Mathf.Cos(yrot));
                float angle = Vector2.SignedAngle(posOffset, angleOffset);
                //Debug.Log(angle);
                
				transform.RotateAround(camera.position, Vector3.up, angle);
				cubeOffset = new Vector3(posOffset.x, 0.9f - camera.position.y, posOffset.y);
                cube.position = camera.position + cubeOffset;
				prev = camera.position;
            }
        }
        if (reorienting) {
			Vector3 position = camera.position;
			transform.position += position - prev;
			transform.position = new Vector3(transform.position.x, 0, transform.position.z);
			prev = position;
            if (cube.GetComponent<TriggerBoolean>().triggered) {
                reorienting = false;
                cube.position = new Vector3(0, -1, 0);
            }
        }
		
		if (transform.childCount < oldChildCount) {
			if (timer < 0) {
				Debug.Log("Timer start");
				timer = Time.time;
			}
			if (transform.childCount > goal) {
				PlaySound("Pickup");
				if (!tree) transform.GetChild(0).GetComponent<CoinObject>().activate();
			}
			else {
				int time = (int) (Time.time - timer);
				Debug.Log(time);
				PlaySound("Success");
				Text message = overlay.GetChild(0).GetComponent<Text>();
				message.text = message.text.Replace("#", time.ToString());
				overlay.gameObject.SetActive(true);
			}
		}
		oldChildCount = transform.childCount;
	}
	
	public void setTree(int g) {
		tree = true;
		goal = g;
	}
	
	public Vector3 apply(Vector3 v) {
		if (!started) {
			return v - new Vector3(0, 1, 0);
		}
		return v;
	}
	
	public void PlaySound(string name) {
		AudioClip clip = Resources.Load<AudioClip>("Sounds/" + name);
		audio.clip = clip;
		audio.Play();
	}
}
