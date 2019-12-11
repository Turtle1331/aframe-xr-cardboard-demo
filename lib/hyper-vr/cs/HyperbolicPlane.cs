using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Valve.VR;

public class HyperbolicPlane : MonoBehaviour {

    public Transform player;
    public SteamVR_Input_Sources handType;
    public SteamVR_Action_Boolean reorientAction;
    public Transform cube;
	public Transform overlay;
	public AudioSource audio;
    
    private Mobius mobius;
    private Transform camera;
    private Vector3 prev;
    private bool started;
    private bool reorienting;
    private Vector3 cubeOffset;
	private int oldChildCount;
	private float timer;
	private bool tree;
	private int goal;

    // Start is called before the first frame update
    void Start() {
        mobius = new Mobius();
        camera = player.Find("SteamVRObjects").Find("VRCamera");
        started = false;
		oldChildCount = 0;
		timer = -1;
    }

    // Update is called once per frame
    void Update() {
        if (started) {
            if (reorienting) {
                prev = camera.position;
            } else {
                Vector3 position = camera.position;
                Vector3 diff = position - prev;
                //diff *= 3;
                mobius.accumulate(new Mobius(-diff.x, -diff.z, true));
                prev = position;
            }
        }
        else {
            Vector2 xy = new Vector2(camera.position.x, camera.position.z);
            started = (xy.magnitude < 0.2);
            if (started) {
                prev = camera.position;
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
                float angle = -Vector2.SignedAngle(posOffset, angleOffset) * Mathf.Deg2Rad;
                //Debug.Log(angle);
                
                mobius.accumulate(new Mobius(angle));
                cubeOffset = new Vector3(posOffset.x, 0.9f - camera.position.y, posOffset.y);
                cube.position = camera.position + cubeOffset;
            }
        }
        if (reorienting) {
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
				foreach (Transform child in transform) {
					GameObject.Destroy(child.gameObject);
				}
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

    public Vector3 apply(Vector3 v, bool norm) {
        if (!started) {
            return v - new Vector3(0, 1, 0);
        }
        if (mobius == null) {
            Debug.Log("mobius is null");
            return v;
        }
        return mobius.apply(v, norm) + new Vector3(camera.position.x, 0, camera.position.z);
    }
	
	public void PlaySound(string name) {
		AudioClip clip = Resources.Load<AudioClip>("Sounds/" + name);
		audio.clip = clip;
		audio.Play();
	}
}