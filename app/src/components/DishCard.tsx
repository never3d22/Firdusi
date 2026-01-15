import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const COLORS = {
  background: '#050505',
  surface: '#0F0B08',
  gold: '#D6B25E',
  goldSoft: '#F5E7B8',
  text: '#F8F5EE',
  muted: '#B9B1A3',
  border: '#2B241A'
};

type DishCardProps = {
  name: string;
  description?: string | null;
  ingredients?: string[];
  priceCents: number;
  imageUrl?: string | null;
  onAdd: () => void;
};

const formatPrice = (priceCents: number) => `${(priceCents / 100).toFixed(0)} ₽`;

export const DishCard: React.FC<DishCardProps> = ({
  name,
  description,
  ingredients,
  priceCents,
  imageUrl,
  onAdd
}) => {
  const ingredientList = ingredients ?? [];

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imageUrl || 'https://placehold.co/1200x800?text=Shaurma' }}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.title}>{name}</Text>
        {description ? <Text style={styles.tagline}>{description}</Text> : null}
        <Text style={styles.ingredientsLabel}>Ингредиенты</Text>
        {ingredientList.length ? (
          <View style={styles.ingredientsRow}>
            {ingredientList.map((item, index) => (
              <View key={`${item}-${index}`} style={styles.ingredientChip}>
                <Text style={styles.ingredientText}>{item}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.ingredientsEmpty}>Ингредиенты уточняются</Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(priceCents)}</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAdd} activeOpacity={0.85}>
            <Text style={styles.addButtonText}>В корзину</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: 170
  },
  body: {
    padding: 16
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700'
  },
  tagline: {
    color: COLORS.muted,
    marginTop: 6
  },
  ingredientsLabel: {
    color: COLORS.goldSoft,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 14
  },
  ingredientsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  ingredientChip: {
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8
  },
  ingredientText: {
    color: COLORS.goldSoft,
    fontSize: 12
  },
  ingredientsEmpty: {
    color: COLORS.muted,
    marginTop: 8
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },
  price: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: '700'
  },
  addButton: {
    backgroundColor: COLORS.gold,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999
  },
  addButtonText: {
    color: COLORS.background,
    fontWeight: '700'
  }
});
