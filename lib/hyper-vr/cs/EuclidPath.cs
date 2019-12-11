using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EuclidPath : MonoBehaviour {

	public Transform pieceType;
    public int numberOfPieces;
    public float distancePerPiece;
    public float angularRange;
    public int randomSeed;

	// Use this for initialization
	void Start () {
		if (randomSeed > 0) Random.InitState(randomSeed);
        Vector3 pos = new Vector3(0, 1, 0);
        for (int i = 0; i < numberOfPieces; i++) {
            //Debug.Log(mob);
            Instantiate(pieceType, pos, Quaternion.identity, transform);
            float angle = (Random.value * 2 - 1) * Mathf.PI * angularRange;
			pos += distancePerPiece * new Vector3(Mathf.Sin(angle), 0, Mathf.Cos(angle));
			//pos = new Vector3(Mathf.Sin(angle), 1, Mathf.Cos(angle));
        }	
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
