using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MapGenApeiro : MonoBehaviour
{

    public Transform pieceType;
    public int numberOfSides;
    public int maximumSteps;

    // Start is called before the first frame update
    void Start()
    {
        CoinObject co = createCoin(new Vector3(0, 1, 0));
		co.setTree(null, 1);
        Mobius mob = new Mobius();
        int sides = numberOfSides;
        int steps = maximumSteps - 1;
        if (steps <= 0) return;
		
		createSubtree(sides, steps, mob, co);
		
		int count = 0;

        for (int i = 0; i < sides - 1; i++) {
            mob.compose(new Mobius(Math.PI * 2 / sides));
			count += createSubtree(sides, steps, mob, null);
        }
		
		transform.GetComponent<HyperbolicPlane>().setTree(count);
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    private int createSubtree(int sides, int steps, Mobius root, CoinObject parent) {
		int count = 0;
		
        Mobius mob = new Mobius(root);
        mob.compose(new Mobius(0, Math.Cos(Math.PI / sides), false));
		CoinObject co = createCoin(mob.apply(new Vector3(0, 1, 0), true));
		co.setTree(parent, sides - 1);
		if (parent == null) {
			co = null;
			count++;
		}
        
        steps--;
        if (steps <= 0) {
			if (parent != null) co.activate();
			return count;
		}

        mob.compose(new Mobius(Math.PI));
        for (int i = 0; i < sides - 1; i++) {
            mob.compose(new Mobius(Mathf.PI * 2 / sides));
            count += createSubtree(sides, steps, mob, co);
        }
		return count;
    }
	
	private CoinObject createCoin(Vector3 position) {
		return ((Transform) Instantiate(pieceType, position, Quaternion.identity, transform)).GetComponent<CoinObject>();
	}
}
