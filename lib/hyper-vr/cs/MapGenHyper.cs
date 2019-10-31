using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MapGenHyper : MonoBehaviour
{

    public Transform pieceType;
    public int numberOfPieces;
    public float maximumRadius;

    // Start is called before the first frame update
    void Start()
    {
        for (int i = 0; i < numberOfPieces; i++) {
            Vector2 xy = Random.insideUnitCircle * maximumRadius;
            Instantiate(pieceType, new Vector3(xy.x, 1, xy.y), Quaternion.identity, transform);
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
