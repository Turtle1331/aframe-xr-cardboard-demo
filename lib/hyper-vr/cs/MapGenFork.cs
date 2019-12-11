/*
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MapGenFork : MonoBehaviour
{

    public Transform pieceType;
    public int numberOfPieces;
    public float distancePerPiece;
    public int forks;
    public float angularRange;
    public int randomSeed;

    // Start is called before the first frame update
    void Start()
    {
        if (randomSeed > 0) Random.InitState(randomSeed);
        Mobius mob = new Mobius();
        for (int i = 0; i < numberOfPieces; i++) {
            //Debug.Log(mob);
            Instantiate(pieceType, mob.apply(new Vector3(0, 1, 0), true), Quaternion.identity, transform);
            mob.compose(new Mobius(0, distancePerPiece, true));
            mob.compose(new Mobius((Mathf.floor(Random.value * forks) - forks * 0.5) * Mathf.PI * angularRange));
        }
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
*/
